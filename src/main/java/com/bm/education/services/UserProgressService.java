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

    @Transactional
    public void saveProgress(Integer userId, Integer courseId, Integer moduleId, Integer lessonId) {
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
            throw new RuntimeException("Error in saveProgress: ", e);
        }
    }
}
