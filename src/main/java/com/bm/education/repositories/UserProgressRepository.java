package com.bm.education.repositories;

import com.bm.education.models.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    Optional<UserProgress> findByUserIdAndLessonId(Long userId, Long lessonId);

    @Query(value = "select count(*) from user_progress where user_id = :userId and course_id = :courseId", nativeQuery = true)
    Long totalCompletedLessonByUserId(@Param("userId") Long userId, @Param("courseId") Long courseId);

    @Query("SELECT count(up) FROM UserProgress up WHERE up.user.id = :userId AND up.module.id = :moduleId AND up.completedAt IS NOT NULL")
    Long countByModuleIdAndUserId(@Param("userId") Long userId, @Param("moduleId") Long moduleId);
}