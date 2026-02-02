package com.bm.education.feat.lesson.service;

import com.bm.education.feat.lesson.dto.CreateLessonRequest;
import com.bm.education.feat.lesson.dto.LessonListResponse;
import com.bm.education.feat.lesson.dto.LessonResponse;
import com.bm.education.feat.lesson.dto.LessonShortResponse;
import com.bm.education.feat.lesson.dto.LessonUpdateRequest;
import com.bm.education.feat.module.dto.ViewModule;
import com.bm.education.feat.module.service.ModuleService;
import com.bm.education.feat.lesson.model.Lesson;
import com.bm.education.feat.module.model.Module;
import com.bm.education.feat.lesson.repository.LessonRepository;
import com.bm.education.feat.module.repository.ModuleRepository;
import com.bm.education.feat.user.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import com.bm.education.feat.lesson.mapper.LessonMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import com.bm.education.shared.exception.ResourceNotFoundException;

/**
 * Service for managing lessons.
 */
@Service

@RequiredArgsConstructor
public class LessonService {
    private final LessonRepository lessonRepository;
    private final ModuleRepository moduleRepository;
    private final UserService userService;
    private final ModuleService moduleService;
    private final LessonMapper lessonMapper;

    /**
     * Gets a lesson by its ID and module ID.
     *
     * @param id       The ID of the lesson.
     * @param moduleId The ID of the module.
     * @return The lesson with the specified ID and module ID, or null if not found.
     */
    @Transactional
    public Lesson getLesson(Long id, Long moduleId) {
        return lessonRepository.findLessonByIdAndModuleId(id, moduleId).orElse(null);
    }

    /**
     * Gets all lessons for a module.
     *
     * @param moduleId The ID of the module.
     * @return A list of lessons for the module.
     */
    @Transactional
    public List<Lesson> getLessonIds(Long moduleId) {
        return lessonRepository.findLessonsByModuleId(moduleId);
    }

    /**
     * Gets the total number of lessons.
     *
     * @return The total number of lessons.
     */
    @Transactional
    public Long getLessonsCount() {
        return lessonRepository.count();
    }

    // Removed manual convertToDTO, use mapper instead

    /**
     * Gets all lessons for a module as a list of DTOs.
     *
     * @param moduleId The ID of the module.
     * @return A list of all lessons for the module as DTOs.
     */
    @Transactional
    public List<LessonListResponse> getModuleLessons(Long moduleId) {
        List<Lesson> lessons = lessonRepository.findLessonsByModuleId(moduleId);
        // Пробегаемся по листу уроков конвертируем каждый обьект lesson в ДТО и
        // собираем кучу дтошек в лист
        return lessons.stream()
                .map(lessonMapper::toListResponse)
                .collect(Collectors.toList());
    }

    /**
     * Counts the number of lessons in a course.
     *
     * @param courseId The ID of the course.
     * @return The number of lessons in the course.
     */
    @Transactional(readOnly = true)
    public Long countByModuleCourseId(Long courseId) {
        return lessonRepository.countByModuleCourseId(courseId);
    }

    /**
     * Counts the number of completed lessons in a course for a user.
     *
     * @param courseId The ID of the course.
     * @param userId   The ID of the user.
     * @return The number of completed lessons in the course for the user.
     */
    public Long countCompletedLessons(Long courseId, Long userId) {
        return lessonRepository.countCompletedLessons(courseId, userId);
    }

    // Removed manual convertToLessonResponseDTO, use mapper instead

    /**
     * Gets a paginated list of lessons as DTOs.
     *
     * @param page     The page number.
     * @param size     The page size.
     * @param moduleId The ID of the module to filter by, or 0 to retrieve all
     *                 lessons.
     * @return A paginated list of lessons as DTOs.
     */
    public Page<LessonResponse> putLessonsInDTO(Integer page, Integer size, Long moduleId) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("id").descending());
        Page<Lesson> lessons;
        if (moduleId == 0L) {
            lessons = lessonRepository.findAllWithModule(pageable);
        } else {
            lessons = lessonRepository.findByModuleIdWithModule(moduleId, pageable);
        }
        return lessons.map(lessonMapper::toResponse);
    }

    /**
     * Gets a paginated list of lessons (alias for putLessonsInDTO).
     */
    public Page<LessonResponse> getLessonsPaginated(int page, int size, Long moduleId) {
        return putLessonsInDTO(page, size, moduleId);
    }

    /**
     * Deletes a lesson by ID.
     */
    @Transactional
    public void deleteLesson(Long lessonId) {
        if (!lessonRepository.existsById(lessonId)) {
            throw new ResourceNotFoundException("Урок", lessonId);
        }
        lessonRepository.deleteById(lessonId);
    }

    /**
     * Gets a short lesson response for editing.
     */
    @Transactional(readOnly = true)
    public LessonShortResponse getLessonShort(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Урок", lessonId));
        return LessonShortResponse.builder()
                .title(lesson.getTitle())
                .content(lesson.getContent())
                .build();
    }

    /**
     * Validates the binding result.
     *
     * @param bindingResult The binding result to validate.
     * @return A response entity with the validation errors, or null if there are no
     *         errors.
     */
    // Removed validation method, use ValidationService in controller

    /**
     * Saves a new lesson.
     *
     * @param dto The DTO containing the lesson details.
     * @return The saved lesson.
     */
    public Lesson saveLesson(CreateLessonRequest request) {
        Module module = moduleRepository.findById(request.moduleId()).orElse(null);
        Lesson lesson = new Lesson();
        lesson.setTitle(request.title());
        lesson.setContent(request.content());
        lesson.setShortDescription(request.shortDescription());
        lesson.setModule(module);
        lesson.setContentLength(request.contentLength());

        return lessonRepository.save(lesson);
    }

    /**
     * Updates a lesson.
     *
     * @param lessonId  The ID of the lesson to update.
     * @param lessonDto The DTO containing the updated lesson details.
     * @return The updated lesson.
     * @throws RuntimeException if the lesson is not found.
     */
    @Transactional
    public Lesson updateLesson(Long lessonId, LessonUpdateRequest request) {
        Lesson lessonToUpdate = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Урок", lessonId));

        lessonToUpdate.setTitle(request.title());
        lessonToUpdate.setContent(request.content());
        lessonToUpdate.setShortDescription(request.shortDescription());

        return lessonRepository.save(lessonToUpdate);
    }

    // Removed getLessonByVideoName as video field is removed.
    // public Lesson getLessonByVideoName(String videoName) { ... }

    /**
     * Gets all lessons with progress for a user in a module.
     *
     * @param userName   The username of the user.
     * @param moduleSlug The slug of the module.
     * @return A list of all lessons with progress for the user in the module.
     */
    @Transactional(readOnly = true)
    public List<ViewModule> getLessonsWithProgress(String userName, String moduleSlug) {
        Long userId = userService.getUserByUsername(userName).getId();
        Long moduleId = moduleService.getModuleBySlug(moduleSlug).getId();
        List<Object[]> results = lessonRepository.findLessonsByModuleAndUserId(userId, moduleId);
        return results.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Maps an object array to a ViewModuleDto.
     *
     * @param result The object array to map.
     * @return The mapped ViewModuleDto.
     */
    private ViewModule mapToDTO(Object[] result) {
        return new ViewModule(
                ((Long) result[0]),
                (String) result[1],
                (String) result[2],
                (String) result[3],
                (String) result[4],
                ((Long) result[5]),
                result[6] != null ? ((java.sql.Timestamp) result[6]).toLocalDateTime() : null);
    }
}