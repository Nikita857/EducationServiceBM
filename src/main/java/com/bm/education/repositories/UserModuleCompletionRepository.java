package com.bm.education.repositories;

import com.bm.education.models.UserModuleCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserModuleCompletionRepository extends JpaRepository<UserModuleCompletion, Long> {
    boolean existsByUser_IdAndModule_Id(Integer userId, Integer moduleId);
    Integer countByUser_IdAndModule_Course_Id(Integer userId, Integer courseId);
}
