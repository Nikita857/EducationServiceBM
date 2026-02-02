package com.bm.education.feat.course.repository;

import com.bm.education.feat.course.model.Course;
import com.bm.education.feat.course.model.CourseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoursesRepository extends JpaRepository<Course, Long> {

    Course findBySlugAndStatus(String courseName, CourseStatus status);

    @Query("SELECT c FROM Course c LEFT JOIN FETCH c.documentation d LEFT JOIN FETCH d.categories WHERE c.slug = :slug AND c.status = :status")
    Course findBySlugWithDocumentation(@Param("slug") String slug, @Param("status") CourseStatus status);

    @Query("SELECT c FROM Course c WHERE c.id IN " +
            "(SELECT uc.course.id FROM UserCourses uc WHERE uc.user.id = :userId AND uc.course.status = :status)")
    List<Course> getAvailableUserCourses(@Param("userId") Long userId, @Param("status") CourseStatus status);

    boolean existsBySlug(String slug);

    Page<Course> findById(Long id, Pageable pageable);

    long count();

}
