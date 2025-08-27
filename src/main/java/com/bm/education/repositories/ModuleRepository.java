package com.bm.education.repositories;

import com.bm.education.models.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bm.education.models.Module;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Integer> {
    @Query(value = "SELECT * FROM modules WHERE course_id = :courseId", nativeQuery = true)
    List<Module> getModulesByCourseId(@Param("courseId") Integer courseId);

    Optional<Module> getModuleBySlug(String slug);
    Optional<Module> findById(Integer id);

    List<Module> findAll();

    @Query(value = "select id, title from lessons where lessons.module_id = :moduleId", nativeQuery = true)
    List<Lesson> lessonsByModuleId(@Param("moduleId") Integer moduleId);

}
