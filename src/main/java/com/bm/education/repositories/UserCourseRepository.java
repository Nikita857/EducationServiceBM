package com.bm.education.repositories;

import com.bm.education.models.Course;
import com.bm.education.models.User;
import com.bm.education.models.UserCourses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;

public interface UserCourseRepository extends JpaRepository<UserCourses, Long> {

    boolean existsByUserAndCourse(User user, Course course);

    List<UserCourses> findByUser(User user);

    void deleteByUserAndCourse(User user, Course course);

    @Modifying
    void deleteByUser_Id(Long userId);
}