package com.bm.education.feat.user.repository;

import com.bm.education.feat.user.model.UserTestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserTestAttemptRepository extends JpaRepository<UserTestAttempt, Long> {
    List<UserTestAttempt> findByUserIdAndLessonId(Long userId, Long lessonId);

    List<UserTestAttempt> findByUserIdAndModuleId(Long userId, Long moduleId);

    List<UserTestAttempt> findByUserIdAndCourseId(Long userId, Long courseId);
}
