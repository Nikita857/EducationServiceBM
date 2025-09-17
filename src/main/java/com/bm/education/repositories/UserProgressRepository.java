package com.bm.education.repositories;

import com.bm.education.models.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Integer> {
    Optional<UserProgress> findByUserIdAndLessonId(int userId, int lessonId);
    @Query(value = "select count(*) from user_progress where user_id = :userId and course_id = :courseId", nativeQuery = true)
    int totalCompletedLessonByUserId(@Param("userId") int userId, @Param("courseId") int courseId);

    @Modifying
    void deleteByUser_Id(Integer userId);
}