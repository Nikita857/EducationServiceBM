package com.bm.education.feat.course.service;

import com.bm.education.feat.course.dto.CourseCreateRequest;
import com.bm.education.feat.course.dto.CourseDetailsResponse;
import com.bm.education.feat.course.dto.CourseResponse;
import com.bm.education.feat.course.dto.CourseUpdateRequest;
import com.bm.education.feat.course.dto.CourseWithProgress;
import com.bm.education.feat.course.model.Course;
import com.bm.education.feat.course.model.CourseDifficulty;
import com.bm.education.feat.course.model.CourseStatus;
import com.bm.education.feat.course.repository.CoursesRepository;
import com.bm.education.feat.course.repository.CategoryRepository;
import com.bm.education.feat.course.mapper.CourseMapper;
import com.bm.education.feat.module.dto.ModuleResponse;
import com.bm.education.feat.module.mapper.ModuleMapper;
import com.bm.education.feat.module.model.Module;
import com.bm.education.feat.module.repository.ModuleRepository;
import com.bm.education.feat.user.repository.UserProgressRepository;
import com.bm.education.feat.user.repository.UserRepository;
import com.bm.education.feat.lesson.service.LessonService;
import com.bm.education.feat.storage.service.MinioService;
import com.bm.education.feat.module.service.ModuleService;
import lombok.RequiredArgsConstructor;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.bm.education.shared.exception.ResourceNotFoundException;

/**
 * Service for managing courses.
 */
@Service
@RequiredArgsConstructor
public class CoursesService {

    private final CoursesRepository coursesRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ModuleRepository moduleRepository;
    private final ModuleService moduleService;
    private final LessonService lessonService;
    private final UserProgressRepository userProgressRepository;
    private final CourseMapper courseMapper;
    private final ModuleMapper moduleMapper;
    private final MinioService minioService;

    public long getCoursesCount() {
        return coursesRepository.count();
    }

    public Course getSelectedCourseBySlug(@NotNull String slug) {
        if (!slug.isEmpty()) {
            return coursesRepository.findBySlugWithDocumentation(slug, CourseStatus.ACTIVE);
        }
        return null;
    }

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

    public CourseResponse createCourse(@NotNull CourseCreateRequest courseRequest, MultipartFile imageFile) {
        if (coursesRepository.existsBySlug(courseRequest.slug())) {
            throw new IllegalArgumentException("Курс с таким URL уже существует");
        }

        if (courseRequest.categoryId() != null && !categoryRepository.existsById(courseRequest.categoryId())) {
            throw new IllegalArgumentException("Категория не найдена");
        }

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

        Course course = new Course();
        course.setTitle(courseRequest.title());
        course.setSlug(courseRequest.slug());
        course.setDescription(courseRequest.description());
        course.setShortDescription(courseRequest.shortDescription());
        course.setEstimatedDuration(courseRequest.estimatedDuration());

        if (courseRequest.difficulty() != null) {
            try {
                course.setDifficulty(
                        com.bm.education.feat.course.model.CourseDifficulty.valueOf(courseRequest.difficulty()));
            } catch (IllegalArgumentException e) {
                // Ignore invalid difficulty
            }
        }

        if (courseRequest.categoryId() != null) {
            categoryRepository.findById(courseRequest.categoryId()).ifPresent(course::setCategory);
        }

        String imageUrl = minioService.uploadFile(imageFile, "courses");
        course.setImage(imageUrl);

        Course savedCourse = coursesRepository.save(course);
        return courseMapper.toResponseDTO(savedCourse);
    }

    public Course findCourseById(Long courseId) {
        return coursesRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Курс", courseId));
    }

    @Transactional
    public Course updateCourse(@NotNull CourseUpdateRequest request) {
        Course existingCourse = coursesRepository.findById(request.id())
                .orElseThrow(() -> new ResourceNotFoundException("Курс", request.id()));

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
        if (request.shortDescription() != null && !request.shortDescription().isBlank()) {
            existingCourse.setShortDescription(request.shortDescription());
        }
        if (request.estimatedDuration() != null) {
            existingCourse.setEstimatedDuration(request.estimatedDuration());
        }
        if (request.difficulty() != null) {
            existingCourse
                    .setDifficulty(CourseDifficulty.valueOf(request.difficulty()));
        }
        if (request.categoryId() != null) {
            existingCourse.setCategory(categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Категория не найдена")));
        }

        if (request.image() != null && !request.image().isEmpty()) {
            String newImageName = minioService.uploadFile(request.image(), "courses");
            existingCourse.setImage(newImageName);
        }

        return coursesRepository.save(existingCourse);
    }

    public Page<CourseResponse> getCoursesForDTO(int page, int size, Long courseId) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Course> courses;
        if (courseId != 0L) {
            courses = coursesRepository.findById(courseId, pageable);
        } else {
            courses = coursesRepository.findAll(pageable);
        }
        return courses.map(courseMapper::toResponseDTO);
    }

    public List<ModuleResponse> getModulesOfCourse(Long courseId) {
        List<Module> modules = moduleService.getModulesByCourseId(courseId);
        return modules.stream()
                .map(m -> moduleMapper.toResponseDTO(m, false, false))
                .collect(Collectors.toList());
    }

    public List<ModuleResponse> getModulesOfCourseWithProgress(Long courseId, Long userId) {
        List<Module> modules = moduleService.getModulesByCourseId(courseId);
        Map<Long, Boolean> completedModulesMap = moduleService.getCompletedModulesOfCourse(courseId, userId);

        return modules.stream()
                .map(module -> {
                    Long totalLessons = (long) lessonService.getLessonIds(module.getId()).size();
                    boolean lessonsCompleted;
                    if (totalLessons > 0) {
                        Long completedLessons = userProgressRepository.countByModuleIdAndUserId(userId,
                                module.getId());
                        lessonsCompleted = totalLessons.equals(completedLessons);
                    } else {
                        lessonsCompleted = true;
                    }
                    boolean testPassed = completedModulesMap.containsKey(module.getId());
                    return moduleMapper.toResponseDTO(module, lessonsCompleted, testPassed);
                })
                .collect(Collectors.toList());
    }

    public List<CourseWithProgress> getCoursesWithProgress(Long userId) {
        try {
            List<Course> userCourses = coursesRepository.getAvailableUserCourses(userId, CourseStatus.ACTIVE);
            return userCourses.stream()
                    .map(course -> {
                        Long progress = calculateCourseProgress(course.getId(), userId);
                        return courseMapper.toCourseWithProgress(course, progress);
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

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

    @Transactional(readOnly = true)
    public List<CourseResponse> findCoursesAndWriteDTO() {
        List<Course> courses = coursesRepository.findAll();
        return courses
                .stream()
                .map(courseMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public void deleteCourseById(Long courseId) {
        if (!coursesRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Курс", courseId);
        }
        coursesRepository.deleteById(courseId);
    }

    @Transactional
    public void updateCourseStatus(String status, Long courseId) {
        Course course = coursesRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Курс", courseId));
        course.setStatus(CourseStatus.valueOf(status));
        coursesRepository.save(course);
    }

    /**
     * Get full course details with modules and progress for a user.
     * Uses a single optimized query to fetch all module stats.
     *
     * @param slug   The slug of the course.
     * @param userId The ID of the user.
     * @return CourseDetailsResponse with full course information.
     */
    @Transactional(readOnly = true)
    public CourseDetailsResponse getCourseDetails(String slug, Long userId) {
        Course course = getSelectedCourseBySlug(slug);
        if (course == null) {
            throw new ResourceNotFoundException("Курс " + slug);
        }

        List<Object[]> moduleStats = moduleRepository.findModulesWithProgress(course.getId(), userId);
        long totalLessons = 0;
        long completedLessons = 0;
        Map<Long, Boolean> completedModules = new java.util.HashMap<>();

        List<ModuleResponse> modules = moduleStats.stream()
                .map(row -> {
                    Long moduleId = ((Number) row[0]).longValue();
                    String title = (String) row[1];
                    String moduleSlug = (String) row[2];
                    long moduleTotalLessons = ((Number) row[5]).longValue();
                    long moduleCompletedLessons = ((Number) row[6]).longValue();
                    boolean testPassed = (Boolean) row[7];

                    boolean lessonsCompleted = moduleTotalLessons == 0 || moduleTotalLessons == moduleCompletedLessons;

                    if (testPassed) {
                        completedModules.put(moduleId, true);
                    }

                    return new ModuleResponse(
                            moduleId,
                            course.getTitle(),
                            moduleSlug,
                            title,
                            "ACTIVE",
                            lessonsCompleted,
                            testPassed);
                })
                .collect(Collectors.toList());

        // Calculate totals from module stats
        for (Object[] row : moduleStats) {
            totalLessons += ((Number) row[5]).longValue();
            completedLessons += ((Number) row[6]).longValue();
        }

        int progressPercent = totalLessons > 0
                ? (int) ((completedLessons * 100) / totalLessons)
                : 0;

        return new CourseDetailsResponse(
                course.getId(),
                course.getTitle(),
                course.getSlug(),
                course.getShortDescription(),
                course.getImage(),
                modules,
                totalLessons,
                completedLessons,
                progressPercent,
                completedModules);
    }
}