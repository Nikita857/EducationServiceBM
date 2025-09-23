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

    @Query(value = "SELECT l FROM Lesson l JOIN FETCH l.module",
            countQuery = "SELECT count(l) FROM Lesson l")
    Page<Lesson> findAllWithModule(Pageable pageable);

    @Query(value = "SELECT l FROM Lesson l JOIN FETCH l.module WHERE l.module.id = :moduleId",
            countQuery = "SELECT count(l) FROM Lesson l WHERE l.module.id = :moduleId")
    Page<Lesson> findByModuleIdWithModule(@Param("moduleId") Integer moduleId, Pageable pageable);

    Optional<Lesson> findLessonByIdAndModuleId(Integer id, Integer moduleId);

    List<Lesson> findLessonsByModuleId(Integer moduleId);

    Optional<Lesson> findLessonById(Integer id);

    @Query("SELECT count(l) FROM Lesson l WHERE l.module.course.id = :courseId")
    Integer countByModuleCourseId(@Param("courseId") Integer courseId);

    @Query("SELECT count(up) FROM UserProgress up WHERE up.user.id = :userId AND up.lesson.module.course.id = :courseId AND up.completedAt IS NOT NULL")
    Integer countCompletedLessons(@Param("courseId") Integer courseId, @Param("userId") Integer userId);

    Optional<Lesson> findLessonByVideo(String video);
    long count();

    @Transactional
    @Query(value = "SELECT l.id, l.title, l.short_description, m.title as module_title, c.title as course_title, " +
            "CASE WHEN up.id IS NOT NULL THEN true ELSE false END as completed, up.completed_at " +
            "FROM lessons l INNER JOIN modules m ON l.module_id = m.id INNER JOIN courses c ON m.course_id = c.id " +
            "LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = :userId WHERE m.id = :moduleId ORDER BY l.id ASC", nativeQuery = true)
    List<Object[]> findLessonsByModuleAndUserId(@Param("userId") Integer userId, @Param("moduleId") Integer moduleId);

    @Query("SELECT l.testCode FROM Lesson l WHERE l.module.id = :moduleId")
    List<String> findTestCodesByModuleId(@Param("moduleId") Integer moduleId);
}