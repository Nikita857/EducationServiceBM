package com.bm.education.repositories;

import com.bm.education.models.Course;
import com.bm.education.models.CourseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoursesRepository extends JpaRepository<Course, Integer> {

    Course findBySlugAndStatus(String courseName, CourseStatus status);
    Integer getCourseIdBySlugAndStatus(String courseName, CourseStatus status);
    Course getCourseById(Integer courseId);

    @Query("SELECT c FROM Course c WHERE c.id IN " +
            "(SELECT uc.course.id FROM UserCourses uc WHERE uc.user.id = :userId AND uc.course.status = :status)")
    List<Course> getAvailableUserCourses(@Param("userId") Integer userId, @Param("status") CourseStatus status);
    boolean existsBySlug(String slug);
    Page<Course> findByStatus(CourseStatus status, Pageable pageable);
}
