package com.bm.education.services;

import com.bm.education.dto.CourseResponseDTO;
import com.bm.education.dto.CourseWithProgressDTO;
import com.bm.education.dto.ModuleResponseDTO;
import com.bm.education.models.Course;
import com.bm.education.models.CourseStatus;
import com.bm.education.models.Module;
import com.bm.education.models.Role;
import com.bm.education.repositories.CoursesRepository;
import com.bm.education.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CoursesService {

    private final CoursesRepository coursesRepository;
    private final UserRepository userRepository;
    private final Path rootLocation = Paths.get("src/main/resources/static/img/course-brand");
    private final ModuleService moduleService;
    private final LessonService lessonService;

    public List<Course> getAllCourses() {return coursesRepository.findAll();}
    public Course getSelectedCourseBySlug(String slug) {
        if (!slug.isEmpty()) {
            return coursesRepository.findBySlugAndStatus(slug, CourseStatus.ACTIVE);
        }
        return null;
    }
    public Optional<Course> getSelectedCourseById(int id) {
        return coursesRepository.findById(id);
    }

    public List<Course> getUserCourses(Integer userId) {
        return userRepository.findById(userId).map(user -> {
            if (user.getRoles().contains(Role.ROLE_ADMIN)) {
                log.info("Права пользователя определены как Администратор");
                return coursesRepository.findAll();
            }
            log.info("Права пользователя определены как ROLE_USER");
            return coursesRepository.getAvailableUserCourses(userId, CourseStatus.ACTIVE);
        }).orElse(null); // или orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId))
    }
    public Course createCourse(Course course, MultipartFile imageFile) throws IOException {
        // Проверяем уникальность slug
        if (coursesRepository.existsBySlug(course.getSlug())) {
            throw new IllegalArgumentException("Курс с таким URL уже существует");
        }

        // Обрабатываем изображение, если оно есть
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = saveImage(imageFile);
            course.setImage(imageUrl);
        }

        return coursesRepository.save(course);
    }

    private String saveImage(MultipartFile file) throws IOException {
        // Создаем директорию, если не существует
        log.info("Курс сервис создание директории при ее отсутствии");
        if (!Files.exists(rootLocation)) {
            log.info("Директории нет -> создаем");
            Files.createDirectories(rootLocation);
        }

        // Генерируем уникальное имя файла
        log.info("генерации имени файла");
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null ?
                originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
        String filename = UUID.randomUUID() + fileExtension;
        log.info("Уникальное имя файла "+filename);

        // Сохраняем файл
        log.info("Сохранение файла");
        Path destinationFile = rootLocation.resolve(Paths.get(filename))
                .normalize().toAbsolutePath();
        log.info("Маршрут сохранения "+destinationFile);

        Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
        log.info("Файл сохранен");
        return filename;
    }

    public Course findCourseById(Integer courseId) {
        return coursesRepository.findById(courseId).orElseThrow(IllegalArgumentException::new);
    }

    private CourseResponseDTO convertToCourseResponseDto(Course course) {
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

    public Page<CourseResponseDTO> getCoursesForDTO(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Course> courses = coursesRepository.findAll(pageable);
        return courses.map(this::convertToCourseResponseDto);
    }

    public ModuleResponseDTO convertToModuleResponseDTO(Module module) {
        return new ModuleResponseDTO(
                module.getId(),
                module.getCourse().getTitle(),
                module.getSlug(),
                module.getTitle(),
                module.getStatus().toString()
        );
    }

    public List<ModuleResponseDTO> getModulesOfCourse(Integer courseId) {
        List<Module> modules = moduleService.getModulesByCourseId(courseId);
        return modules.stream()
                .map(this::convertToModuleResponseDTO)
                .collect(Collectors.toList());
    }
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
            log.error("Error getting courses with progress for user: {}", userId, e);
            return Collections.emptyList(); // Возвращаем пустой список вместо null
        }
    }

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
            log.warn("Error calculating progress for course: {} and user: {}", courseId, userId, e);
            return 0;
        }
    }
    public List<CourseResponseDTO> findCoursesAndWriteDTO() {
        List<Course> courses = coursesRepository.findAll();
        return courses
                .stream()
                .map(this::convertToCoursesDto)
                .collect(Collectors.toList());
    }

    public CourseWithProgressDTO convertToCourseWithProgressDTO(Course course) {
        CourseWithProgressDTO cwp = new CourseWithProgressDTO();
        cwp.setId(course.getId());
        cwp.setTitle(course.getTitle());
        cwp.setDescription(course.getDescription());
        cwp.setSlug(course.getSlug());
        cwp.setImage(course.getImage());
        return cwp;
    }

    public CourseResponseDTO convertToCoursesDto(Course course) {
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

    public boolean deleteCourseById(Integer courseId) {
        if(coursesRepository.existsById(courseId)) {
            coursesRepository.deleteById(courseId);
            return true;
        }else{
            return false;
        }
    }
}
