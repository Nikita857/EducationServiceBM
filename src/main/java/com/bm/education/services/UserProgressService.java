package com.bm.education.services;

import com.bm.education.models.Course;
import com.bm.education.models.Lesson;
import com.bm.education.models.User;
import com.bm.education.models.UserProgress;
import com.bm.education.models.Module;
import com.bm.education.repositories.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserProgressService {

    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;
    private final CoursesRepository coursesRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;

    public void saveProgress(Integer userId, Integer courseId, Integer moduleId, Integer lessonId) {
        log.info("Saving progress - userId: {}, courseId: {}, moduleId: {}, lessonId: {}",
                userId, courseId, moduleId, lessonId);

        try {
            // Проверяем существование сущностей
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> {
                        log.error("User not found with id: {}", userId);
                        return new EntityNotFoundException("User not found");
                    });

            Course course = coursesRepository.findById(courseId)
                    .orElseThrow(() -> {
                        log.error("Course not found with id: {}", courseId);
                        return new EntityNotFoundException("Course not found");
                    });

            Module module = moduleRepository.findById(moduleId)
                    .orElseThrow(() -> {
                        log.error("Module not found with id: {}", moduleId);
                        return new EntityNotFoundException("Module not found");
                    });

            Lesson lesson = lessonRepository.findById(lessonId)
                    .orElseThrow(() -> {
                        log.error("Lesson not found with id: {}", lessonId);
                        return new EntityNotFoundException("Lesson not found");
                    });

            // Проверяем, существует ли уже запись
            Optional<UserProgress> existingProgress = userProgressRepository
                    .findByUserIdAndLessonId(userId, lessonId);

            UserProgress progress;
            if (existingProgress.isPresent()) {
                progress = existingProgress.get();
                log.info("Updating existing progress record: {}", progress.getId());
            } else {
                progress = new UserProgress();
                log.info("Creating new progress record");
            }

            progress.setUser(user);
            progress.setCourse(course);
            progress.setModule(module);
            progress.setLesson(lesson);
            progress.setCompletedAt(Instant.now());

            UserProgress savedProgress = userProgressRepository.save(progress);
            log.info("Progress saved with ID: {}", savedProgress.getId());

        } catch (Exception e) {
            log.error("Error in saveProgress: ", e);
            throw e;
        }
    }
}
