package com.bm.education.repositories;

import com.bm.education.models.Lesson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface LessonRepository extends JpaRepository<Lesson, Integer> {

    Optional<Lesson> findLessonByIdAndModuleId(Integer id, Integer moduleId);

    List<Lesson> findLessonsByModuleId(Integer moduleId);

    Optional<Lesson> findLessonById(Integer id);

    @Query("SELECT count(l) FROM Lesson l WHERE l.module.course.id = :courseId")
    Integer countByModuleCourseId(@Param("courseId") Integer courseId);

    @Query("SELECT count(up) FROM UserProgress up WHERE up.user.id = :userId AND up.lesson.module.course.id = :courseId AND up.completedAt IS NOT NULL")
    Integer countCompletedLessons(@Param("courseId") Integer courseId, @Param("userId") Integer userId);

    Optional<Lesson> findLessonByVideo(String video);
    Page<Lesson> findByModuleId(Integer moduleId, Pageable pageable);
    long count();

    @Transactional
    @Query(value = "SELECT l.id, l.title, l.short_description, m.title as module_title, c.title as course_title, " +
            "CASE WHEN up.id IS NOT NULL THEN true ELSE false END as completed, up.completed_at " +
            "FROM lessons l INNER JOIN modules m ON l.module_id = m.id INNER JOIN courses c ON m.course_id = c.id " +
            "LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = ? WHERE m.id = ? ORDER BY l.id;", nativeQuery = true)
    List<Object[]> findLessonsByModuleAndUserId(@Param("moduleId") Integer moduleId, @Param("userId") Integer userId);
}
