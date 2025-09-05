package com.bm.education.repositories;

import com.bm.education.models.Course;
import com.bm.education.models.User;
import com.bm.education.models.UserCourses;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserCourseRepository extends JpaRepository<UserCourses, Integer> {

    boolean existsByUserAndCourse(User user, Course course);
    List<UserCourses> findByUser(User user);
}
