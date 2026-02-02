package com.bm.education.feat.lesson.repository;

import com.bm.education.feat.lesson.model.Lesson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LessonRepository extends JpaRepository<Lesson, Long> {

        @Query(value = "SELECT l FROM Lesson l JOIN FETCH l.module", countQuery = "SELECT count(l) FROM Lesson l")
        Page<Lesson> findAllWithModule(Pageable pageable);

        @Query(value = "SELECT l FROM Lesson l JOIN FETCH l.module WHERE l.module.id = :moduleId", countQuery = "SELECT count(l) FROM Lesson l WHERE l.module.id = :moduleId")
        Page<Lesson> findByModuleIdWithModule(@Param("moduleId") Long moduleId, Pageable pageable);

        Optional<Lesson> findLessonByIdAndModuleId(Long id, Long moduleId);

        List<Lesson> findLessonsByModuleId(Long moduleId);

        Optional<Lesson> findLessonById(Long id);

        @Query("SELECT count(l) FROM Lesson l WHERE l.module.course.id = :courseId")
        Long countByModuleCourseId(@Param("courseId") Long courseId);

        @Query("SELECT count(up) FROM UserProgress up WHERE up.user.id = :userId AND up.lesson.module.course.id = :courseId AND up.completedAt IS NOT NULL")
        Long countCompletedLessons(@Param("courseId") Long courseId, @Param("userId") Long userId);

        Optional<Lesson> findLessonByVideo(String video);

        long count();

        @Query(value = "SELECT l.id, l.title, l.short_description, m.title as module_title, c.title as course_title, " +
                        "CASE WHEN up.id IS NOT NULL THEN true ELSE false END as completed, up.completed_at " +
                        "FROM lessons l INNER JOIN modules m ON l.module_id = m.id INNER JOIN courses c ON m.course_id = c.id "
                        +
                        "LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = :userId WHERE m.id = :moduleId ORDER BY l.id ASC", nativeQuery = true)
        List<Object[]> findLessonsByModuleAndUserId(@Param("userId") Long userId, @Param("moduleId") Long moduleId);

        @Query("SELECT l.testCode FROM Lesson l WHERE l.module.id = :moduleId")
        List<String> findTestCodesByModuleId(@Param("moduleId") Long moduleId);
}