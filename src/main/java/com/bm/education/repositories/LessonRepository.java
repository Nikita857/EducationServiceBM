package com.bm.education.repositories;

import com.bm.education.models.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LessonRepository extends JpaRepository<Lesson, Integer> {

    Optional<Lesson> findLessonByIdAndModuleId(Integer id, Integer moduleId);

    List<Lesson> findLessonsByModuleId(Integer moduleId);

    Optional<Lesson> findLessonById(Integer id);

    @Query(value = "SELECT COUNT(*) AS total_lessons FROM lessons l JOIN modules m ON l.module_id = m.id WHERE m.course_id = :courseId", nativeQuery = true)
    Integer countLessonsByCourseId(@Param("courseId") Integer courseId);

    List<Lesson> findAll();

    @Query("SELECT l FROM Lesson l JOIN l.module m WHERE m.course.id = :courseId")
    List<Lesson> findAllCourseLessons(@Param("courseId") Integer courseId);

    // Метод для завершенных уроков
    @Query("SELECT l FROM Lesson l JOIN l.module m JOIN UserProgress up ON up.lesson.id = l.id " +
            "WHERE m.course.id = :courseId AND up.user.id = :userId")
    List<Lesson> findCompletedLessonsByCourseAndUser(@Param("courseId") Integer courseId,
                                                     @Param("userId") Integer userId);


}
