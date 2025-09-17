package com.bm.education.services;

import com.bm.education.dto.*;
import com.bm.education.models.Course;
import com.bm.education.models.CourseStatus;
import com.bm.education.models.Module;
import com.bm.education.models.Role;
import com.bm.education.repositories.CoursesRepository;
import com.bm.education.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for managing courses.
 */
@Service

@RequiredArgsConstructor
public class CoursesService {

    private final CoursesRepository coursesRepository;
    private final UserRepository userRepository;
    private final Path rootLocation = Paths.get("src/main/resources/static/img/course-brand");
    private final ModuleService moduleService;
    private final LessonService lessonService;

    /**
     * Gets the total number of courses.
     *
     * @return The total number of courses.
     */
    public long getCoursesCount() {return coursesRepository.count();}

    /**
     * Gets a course by its slug.
     *
     * @param slug The slug of the course.
     * @return The course with the specified slug, or null if not found.
     */
    public Course getSelectedCourseBySlug(@NotNull String slug) {
        if (!slug.isEmpty()) {
            return coursesRepository.findBySlugAndStatus(slug, CourseStatus.ACTIVE);
        }
        return null;
    }

    /**
     * Gets all courses for a user.
     *
     * @param userId The ID of the user.
     * @return A list of courses for the user.
     */
    public List<Course> getUserCourses(Integer userId) {
        return userRepository.findById(userId).map(user -> {
            if (user.getRoles().contains(Role.ROLE_ADMIN)) {
                
                return coursesRepository.findAll();
            }
            
            return coursesRepository.getAvailableUserCourses(userId, CourseStatus.ACTIVE);
        }).orElse(null); // или orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId))
    }

    /**
     * Creates a new course.
     *
     * @param courseRequest The request object containing the course details.
     * @param imageFile The image file for the course.
     * @return The created course.
     * @throws IOException if there is an error while saving the image file.
     * @throws IllegalArgumentException if the course with the same slug already exists or the image file is invalid.
     */
    public Course createCourse(@NotNull CourseCreateRequest courseRequest, MultipartFile imageFile) throws IOException {
        // Проверяем уникальность slug
        if (coursesRepository.existsBySlug(courseRequest.getSlug())) {
            throw new IllegalArgumentException("Курс с таким URL уже существует");
        }

        // Проверяем тип файла
        if (imageFile == null || imageFile.isEmpty()) {
            throw new IllegalArgumentException("Изображение для курса обязательно");
        }
        
        String contentType = imageFile.getContentType();
        if (contentType == null ||
                (!contentType.equals("image/jpeg") &&
                 !contentType.equals("image/png") &&
                 !contentType.equals("image/gif"))) {
            throw new IllegalArgumentException("Разрешены только файлы JPG, PNG или GIF");
        }

        // Конвертируем DTO в Entity
        Course course = new Course();
        course.setTitle(courseRequest.getTitle());
        course.setSlug(courseRequest.getSlug());
        course.setDescription(courseRequest.getDescription());

        // Обрабатываем изображение
        String imageUrl = saveImage(imageFile);
        course.setImage(imageUrl);

        return coursesRepository.save(course);
    }

    /**
     * Saves an image file.
     *
     * @param file The image file to save.
     * @return The name of the saved image file.
     * @throws IOException if there is an error while saving the image file.
     */
    private @NotNull String saveImage(MultipartFile file) throws IOException {
        // Создаем директорию, если не существует
        
        if (!Files.exists(rootLocation)) {
            
            Files.createDirectories(rootLocation);
        }

        // Генерируем уникальное имя файла
        
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null ?
                originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
        String filename = UUID.randomUUID() + fileExtension;
        

        // Сохраняем файл
        
        Path destinationFile = rootLocation.resolve(Paths.get(filename))
                .normalize().toAbsolutePath();
        

        Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
        
        return filename;
    }

    /**
     * Finds a course by its ID.
     *
     * @param courseId The ID of the course.
     * @return The course with the specified ID.
     * @throws IllegalArgumentException if the course is not found.
     */
    public Course findCourseById(Integer courseId) {
        return coursesRepository.findById(courseId).orElseThrow(IllegalArgumentException::new);
    }

    /**
     * Updates a course.
     *
     * @param request The request object containing the updated course details.
     * @return The updated course.
     * @throws IOException if there is an error while saving the image file.
     * @throws IllegalArgumentException if the course is not found or the course with the same slug already exists.
     */
    public Course updateCourse(@NotNull CourseUpdateRequest request) throws IOException {
        Course existingCourse = coursesRepository.findById(request.getId())
                .orElseThrow(() -> new IllegalArgumentException("Курс с id " + request.getId() + " не найден"));

        if (request.getSlug() != null && !request.getSlug().isBlank() && !request.getSlug().equals(existingCourse.getSlug())) {
            if (coursesRepository.existsBySlug(request.getSlug())) {
                throw new IllegalArgumentException("Курс с таким URL уже существует");
            }
            existingCourse.setSlug(request.getSlug());
        }

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            existingCourse.setTitle(request.getTitle());
        }
        if (request.getDescription() != null && !request.getDescription().isBlank()) {
            existingCourse.setDescription(request.getDescription());
        }

        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String newImageName = saveImage(request.getImage());
            existingCourse.setImage(newImageName);
        }

        return coursesRepository.save(existingCourse);
    }

    /**
     * Converts a course to a CourseResponseDTO.
     *
     * @param course The course to convert.
     * @return The converted CourseResponseDTO.
     */
    @Contract("_ -> new")
    private @NotNull CourseResponseDTO convertToCourseResponseDto(@NotNull Course course) {
        return new CourseResponseDTO(
                course.getId(),
                course.getTitle(),
                course.getImage(),
                course.getDescription(),
                course.getSlug(),
                course.getStatus().toString(),
                course.getCreatedAt().toString(),
                course.getUpdatedAt().toString()
        );
    }

    /**
     * Gets a paginated list of courses.
     *
     * @param page The page number.
     * @param size The page size.
     * @param courseId The ID of the course to retrieve, or 0 to retrieve all courses.
     * @return A paginated list of courses.
     */
    public Page<CourseResponseDTO> getCoursesForDTO(Integer page, Integer size, Integer courseId) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        //Пиздатый подход, потому что сразу выделяем память под объект а только потом устанавливаем ему значение
        Page<Course> courses;
        if(courseId != 0) {
            courses = coursesRepository.findById(courseId, pageable);
        }else{
            courses = coursesRepository.findAll(pageable);
        }
        return courses.map(this::convertToCourseResponseDto);
    }

    /**
     * Converts a module to a ModuleResponseDTO.
     *
     * @param module The module to convert.
     * @return The converted ModuleResponseDTO.
     */
    public ModuleResponseDTO convertToModuleResponseDTO(@NotNull Module module) {
        return new ModuleResponseDTO(
                module.getId(),
                module.getCourse().getTitle(),
                module.getSlug(),
                module.getTitle(),
                module.getStatus().toString()
        );
    }

    /**
     * Gets all modules for a course.
     *
     * @param courseId The ID of the course.
     * @return A list of modules for the course.
     */
    public List<ModuleResponseDTO> getModulesOfCourse(Integer courseId) {
        List<Module> modules = moduleService.getModulesByCourseId(courseId);
        return modules.stream()
                .map(this::convertToModuleResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Gets all courses with progress for a user.
     *
     * @param userId The ID of the user.
     * @return A list of courses with progress for the user.
     */
    public List<CourseWithProgressDTO> getCoursesWithProgress(Integer userId) {
        try {
            List<Course> userCourses = coursesRepository.getAvailableUserCourses(userId, CourseStatus.ACTIVE);
            return userCourses.stream()
                    .map(course -> {
                        CourseWithProgressDTO dto = convertToCourseWithProgressDTO(course);
                        Integer progress = calculateCourseProgress(course.getId(), userId);
                        dto.setProgress(progress);
                        return dto;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    /**
     * Calculates the progress of a course for a user.
     *
     * @param courseId The ID of the course.
     * @param userId The ID of the user.
     * @return The progress of the course for the user.
     */
    private Integer calculateCourseProgress(Integer courseId, Integer userId) {
        try {
            Integer totalLessons = lessonService.countByModuleCourseId(courseId);
            if (totalLessons == 0) {
                return 0;
            }
            Integer completedLessons = lessonService.countCompletedLessons(courseId, userId);
            double progressPercentage = (completedLessons.doubleValue() / totalLessons.doubleValue()) * 100;
            return (int) Math.round(progressPercentage);
        } catch (Exception e) {
            
            return 0;
        }
    }

    /**
     * Finds all courses and converts them to a list of CourseResponseDTOs.
     *
     * @return A list of all courses as CourseResponseDTOs.
     */
    public List<CourseResponseDTO> findCoursesAndWriteDTO() {
        List<Course> courses = coursesRepository.findAll();
        return courses
                .stream()
                .map(this::convertToCoursesDto)
                .collect(Collectors.toList());
    }

    /**
     * Converts a course to a CourseWithProgressDTO.
     *
     * @param course The course to convert.
     * @return The converted CourseWithProgressDTO.
     */
    public CourseWithProgressDTO convertToCourseWithProgressDTO(@NotNull Course course) {
        CourseWithProgressDTO cwp = new CourseWithProgressDTO();
        cwp.setId(course.getId());
        cwp.setTitle(course.getTitle());
        cwp.setDescription(course.getDescription());
        cwp.setSlug(course.getSlug());
        cwp.setImage(course.getImage());
        return cwp;
    }

    /**
     * Converts a course to a CourseResponseDTO.
     *
     * @param course The course to convert.
     * @return The converted CourseResponseDTO.
     */
    public CourseResponseDTO convertToCoursesDto(@NotNull Course course) {
        return new CourseResponseDTO(
                course.getId(),
                course.getTitle(),
                course.getImage(),
                course.getDescription(),
                course.getSlug(),
                course.getStatus().toString(),
                course.getCreatedAt().toString(),
                course.getUpdatedAt().toString()
                );
    }

    /**
     * Deletes a course by its ID.
     *
     * @param courseId The ID of the course to delete.
     * @return true if the course was deleted successfully, false otherwise.
     */
    public boolean deleteCourseById(Integer courseId) {
        if(coursesRepository.existsById(courseId)) {
            coursesRepository.deleteById(courseId);
            return true;
        }else{
            return false;
        }
    }

    /**
     * Updates the status of a course.
     *
     * @param status The new status of the course.
     * @param courseId The ID of the course to update.
     * @return true if the course status was updated successfully, false otherwise.
     * @throws IllegalArgumentException if the course is not found.
     */
    @Transactional
    public boolean updateCourseStatus(String status, Integer courseId) {
        Course course = coursesRepository.findById(courseId).orElseThrow(
                () -> new IllegalArgumentException("Course not found")
        );
        course.setStatus(CourseStatus.valueOf(status));
        
        Course updatedCourse = coursesRepository.save(course);
        
        return updatedCourse.getStatus() == CourseStatus.valueOf(status);
    }
}