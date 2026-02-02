package com.bm.education.feat.user.repository;

import com.bm.education.feat.user.model.UserModuleCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserModuleCompletionRepository extends JpaRepository<UserModuleCompletion, Long> {
    boolean existsByUser_IdAndModule_Id(Long userId, Long moduleId);

    Long countByUser_IdAndModule_Course_Id(Long userId, Long courseId);

    @Query("SELECT umc.module.id FROM UserModuleCompletion umc WHERE umc.user.id = :userId AND umc.module.course.id = :courseId")
    List<Long> findCompletedModuleIdsByCourse(@Param("userId") Long userId, @Param("courseId") Long courseId);

    // List<UserModuleCompletion> findByModule(Long courseId);
}
