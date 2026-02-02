package com.bm.education.repositories;

import com.bm.education.models.UserCourseCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserCourseCompletionRepository extends JpaRepository<UserCourseCompletion, Long> {
    boolean existsByUser_IdAndCourse_Id(Long userId, Long courseId);
}
