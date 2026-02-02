package com.bm.education.services;

import com.bm.education.dto.*;
import com.bm.education.mappers.CourseMapper;
import com.bm.education.mappers.ModuleMapper;
import com.bm.education.models.*;
import com.bm.education.models.Module;
import com.bm.education.repositories.*;
import lombok.RequiredArgsConstructor;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for managing courses.
 */
@Service

@RequiredArgsConstructor
public class CoursesService {

    private final CoursesRepository coursesRepository;
    private final UserRepository userRepository;
    private final ModuleService moduleService;
    private final LessonService lessonService;
    private final UserProgressRepository userProgressRepository;
    private final CourseMapper courseMapper;
    private final ModuleMapper moduleMapper;
    private final MinioService minioService;

    /**
     * Gets the total number of courses.
     *
     * @return The total number of courses.
     */
    public long getCoursesCount() {
        return coursesRepository.count();
    }

    /**
     * Gets a course by its slug.
     *
     * @param slug The slug of the course.
     * @return The course with the specified slug, or null if not found.
     */
    public Course getSelectedCourseBySlug(@NotNull String slug) {
        if (!slug.isEmpty()) {
            return coursesRepository.findBySlugWithDocumentation(slug, CourseStatus.ACTIVE);
        }
        return null;
    }

    /**
     * Gets all courses for a user.
     *
     * @param userId The ID of the user.
     * @return A list of courses for the user.
     */
    public List<Course> getUserCourses(Long userId) {
        return userRepository.findById(userId).map(user -> {
            boolean isAdmin = user.getRoles().stream()
                    .anyMatch(role -> role.getName().equals("ROLE_ADMIN"));
            if (isAdmin) {

                return coursesRepository.findAll();
            }
            return coursesRepository.getAvailableUserCourses(userId, CourseStatus.ACTIVE);
        }).orElse(null);
    }

    /**
     * Creates a new course.
     *
     * @param courseRequest The request object containing the course details.
     * @param imageFile     The image file for the course.
     * @return The created course.
     * @throws IOException              if there is an error while saving the image
     *                                  file.
     * @throws IllegalArgumentException if the course with the same slug already
     *                                  exists or the image file is invalid.
     */
    public Course createCourse(@NotNull CourseCreateRequest courseRequest, MultipartFile imageFile) throws IOException {
        // Проверяем уникальность slug
        if (coursesRepository.existsBySlug(courseRequest.slug())) {
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
        course.setTitle(courseRequest.title());
        course.setSlug(courseRequest.slug());
        course.setDescription(courseRequest.description());

        // Обрабатываем изображение
        String imageUrl = minioService.uploadFile(imageFile, "courses");
        course.setImage(imageUrl);

        return coursesRepository.save(course);
    }

    /**
     * Finds a course by its ID.
     *
     * @param courseId The ID of the course.
     * @return The course with the specified ID.
     * @throws IllegalArgumentException if the course is not found.
     */
    public Course findCourseById(Long courseId) {
        return coursesRepository.findById(courseId).orElseThrow(IllegalArgumentException::new);
    }

    /**
     * Updates a course.
     *
     * @param request The request object containing the updated course details.
     * @return The updated course.
     * @throws IOException              if there is an error while saving the image
     *                                  file.
     * @throws IllegalArgumentException if the course is not found or the course
     *                                  with the same slug already exists.
     */
    @Transactional
    public Course updateCourse(@NotNull CourseUpdateRequest request) throws IOException {
        Course existingCourse = coursesRepository.findById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("Курс с id " + request.id() + " не найден"));

        if (request.slug() != null && !request.slug().isBlank() && !request.slug().equals(existingCourse.getSlug())) {
            if (coursesRepository.existsBySlug(request.slug())) {
                throw new IllegalArgumentException("Курс с таким URL уже существует");
            }
            existingCourse.setSlug(request.slug());
        }

        if (request.title() != null && !request.title().isBlank()) {
            existingCourse.setTitle(request.title());
        }
        if (request.description() != null && !request.description().isBlank()) {
            existingCourse.setDescription(request.description());
        }

        if (request.image() != null && !request.image().isEmpty()) {
            String newImageName = minioService.uploadFile(request.image(), "courses");
            existingCourse.setImage(newImageName);
        }

        return coursesRepository.save(existingCourse);
    }

    /**
     * Gets a paginated list of courses.
     *
     * @param page     The page number.
     * @param size     The page size.
     * @param courseId The ID of the course to retrieve, or 0 to retrieve all
     *                 courses.
     * @return A paginated list of courses.
     */
    public Page<CourseResponseDTO> getCoursesForDTO(int page, int size, Long courseId) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        // Пиздатый подход, потому что сразу выделяем память под объект а только потом
        // устанавливаем ему значение
        Page<Course> courses;
        if (courseId != 0L) {
            courses = coursesRepository.findById(courseId, pageable);
        } else {
            courses = coursesRepository.findAll(pageable);
        }
        return courses.map(courseMapper::toResponseDTO);
    }

    /**
     * Gets all modules for a course.
     *
     * @param courseId The ID of the course.
     * @return A list of modules for the course.
     */
    public List<ModuleResponseDTO> getModulesOfCourse(Long courseId) {
        List<Module> modules = moduleService.getModulesByCourseId(courseId);
        return modules.stream()
                .map(m -> moduleMapper.toResponseDTO(m, false, false))
                .collect(Collectors.toList());
    }

    /**
     * Gets all modules for a course, including completion status for a user.
     *
     * @param courseId The ID of the course.
     * @param userId   The ID of the user.
     * @return A list of modules for the course.
     */
    public List<ModuleResponseDTO> getModulesOfCourseWithProgress(Long courseId, Long userId) {
        List<Module> modules = moduleService.getModulesByCourseId(courseId);
        // Get all completed modules for this course in one query
        Map<Long, Boolean> completedModulesMap = moduleService.getCompletedModulesOfCourse(courseId, userId);

        return modules.stream()
                .map(module -> {
                    // Check if all lessons are done
                    Long totalLessons = (long) lessonService.getLessonIds(module.getId()).size();
                    boolean lessonsCompleted;
                    if (totalLessons > 0) {
                        Long completedLessons = userProgressRepository.countByModuleIdAndUserId(userId,
                                module.getId());
                        lessonsCompleted = totalLessons.equals(completedLessons);
                    } else {
                        lessonsCompleted = true; // Module with no lessons is considered to have its lessons completed
                    }

                    // Check if the module test has been passed from the pre-fetched map
                    boolean testPassed = completedModulesMap.containsKey(module.getId());

                    return moduleMapper.toResponseDTO(module, lessonsCompleted, testPassed);
                })
                .collect(Collectors.toList());
    }

    /**
     * Gets all courses with progress for a user.
     *
     * @param userId The ID of the user.
     * @return A list of courses with progress for the user.
     */
    public List<CourseWithProgressDTO> getCoursesWithProgress(Long userId) {
        try {
            List<Course> userCourses = coursesRepository.getAvailableUserCourses(userId, CourseStatus.ACTIVE);
            return userCourses.stream()
                    .map(course -> {
                        Long progress = calculateCourseProgress(course.getId(), userId);
                        return courseMapper.toWithProgressDTO(course, progress);
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
     * @param userId   The ID of the user.
     * @return The progress of the course for the user.
     */
    private Long calculateCourseProgress(Long courseId, Long userId) {
        try {
            Long totalLessons = lessonService.countByModuleCourseId(courseId);
            if (totalLessons == 0) {
                return 0L;
            }
            Long completedLessons = lessonService.countCompletedLessons(courseId, userId);
            double progressPercentage = (completedLessons.doubleValue() / totalLessons.doubleValue()) * 100;
            return (long) Math.round(progressPercentage);
        } catch (Exception e) {

            return 0L;
        }
    }

    /**
     * Finds all courses and converts them to a list of CourseResponseDTOs.
     *
     * @return A list of all courses as CourseResponseDTOs.
     */
    @Transactional(readOnly = true)
    public List<CourseResponseDTO> findCoursesAndWriteDTO() {
        List<Course> courses = coursesRepository.findAll();
        return courses
                .stream()
                .map(courseMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Deletes a course by its ID.
     *
     * @param courseId The ID of the course to delete.
     * @return true if the course was deleted successfully, false otherwise.
     */
    public boolean deleteCourseById(Long courseId) {
        if (coursesRepository.existsById(courseId)) {
            coursesRepository.deleteById(courseId);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Updates the status of a course.
     *
     * @param status   The new status of the course.
     * @param courseId The ID of the course to update.
     * @return true if the course status was updated successfully, false otherwise.
     * @throws IllegalArgumentException if the course is not found.
     */
    @Transactional
    public boolean updateCourseStatus(String status, Long courseId) {
        Course course = coursesRepository.findById(courseId).orElseThrow(
                () -> new IllegalArgumentException("Course not found"));
        course.setStatus(CourseStatus.valueOf(status));

        Course updatedCourse = coursesRepository.save(course);

        return updatedCourse.getStatus() == CourseStatus.valueOf(status);
    }
}