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

    @Query("SELECT count(l) FROM Lesson l WHERE l.module.course.id = :courseId")
    Integer countByModuleCourseId(@Param("courseId") Integer courseId);

    @Query("SELECT count(up) FROM UserProgress up WHERE up.user.id = :userId AND up.lesson.module.course.id = :courseId AND up.completedAt IS NOT NULL")
    Integer countCompletedLessons(@Param("courseId") Integer courseId, @Param("userId") Integer userId);

    Optional<Lesson> findLessonByVideo(String video);
}
