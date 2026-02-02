package com.bm.education.feat.course.repository;

import com.bm.education.feat.course.model.Course;
import com.bm.education.feat.user.model.User;
import com.bm.education.feat.user.model.UserCourses;
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