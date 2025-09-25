package com.bm.education.repositories;

import com.bm.education.models.UserModuleCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserModuleCompletionRepository extends JpaRepository<UserModuleCompletion, Long> {
    boolean existsByUser_IdAndModule_Id(Integer userId, Integer moduleId);
    Integer countByUser_IdAndModule_Course_Id(Integer userId, Integer courseId);

    @Query("SELECT umc.module.id FROM UserModuleCompletion umc WHERE umc.user.id = :userId AND umc.module.course.id = :courseId")
    List<Integer> findCompletedModuleIdsByCourse(@Param("userId") Integer userId, @Param("courseId") Integer courseId);

    //List<UserModuleCompletion> findByModule(Long courseId);
}
