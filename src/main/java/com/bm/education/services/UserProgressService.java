package com.bm.education.services;

import com.bm.education.models.Module;
import com.bm.education.models.*;
import com.bm.education.repositories.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Service for managing user progress.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserProgressService {

    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;
    private final CoursesRepository coursesRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final UserModuleCompletionRepository userModuleCompletionRepository;
    private final ModuleService moduleService;

    /**
     * Saves the progress of a user for a lesson.
     *
     * @param userId   The ID of the user.
     * @param courseId The ID of the course.
     * @param moduleId The ID of the module.
     * @param lessonId The ID of the lesson.
     * @throws EntityNotFoundException if the user, course, module, or lesson is not
     *                                 found.
     * @throws RuntimeException        if there is an error while saving the
     *                                 progress.
     */
    @Transactional
    public void saveProgress(Long userId, Long courseId, Long moduleId, Long lessonId) {
        try {
            // Проверяем существование сущностей
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));

            Course course = coursesRepository.findById(courseId)
                    .orElseThrow(() -> new EntityNotFoundException("Course not found"));

            Module module = moduleRepository.findById(moduleId)
                    .orElseThrow(() -> new EntityNotFoundException("Module not found"));

            Lesson lesson = lessonRepository.findById(lessonId)
                    .orElseThrow(() -> new EntityNotFoundException("Lesson not found"));

            // Проверяем, существует ли уже запись
            Optional<UserProgress> existingProgress = userProgressRepository
                    .findByUserIdAndLessonId(userId, lessonId);

            UserProgress progress = existingProgress.orElseGet(UserProgress::new);

            progress.setUser(user);
            progress.setCourse(course);
            progress.setModule(module);
            progress.setLesson(lesson);
            progress.setCompletedAt(Instant.now());

            userProgressRepository.save(progress);

        } catch (Exception e) {

            throw new RuntimeException("Error in saveProgress: ", e);
        }
    }

    @Transactional
    public Long numberOfCompletedLessonsOfModule(Long userId, Long moduleId) {
        return userProgressRepository.countByModuleIdAndUserId(userId, moduleId);
    }

    @Transactional(readOnly = true)
    public Map<String, String> getCourseProgress(Long userId, Long courseId) {
        Map<String, String> progress = new HashMap<>();
        Long courseModules = (long) moduleService.getModulesByCourseId(courseId).size();

        Long completedModules = userModuleCompletionRepository.countByUser_IdAndModule_Course_Id(userId, courseId);
        progress.put("courseModules", String.format("%d/%d", completedModules, courseModules));
        return progress;
    }
}