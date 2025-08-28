package com.bm.education.repositories;

import com.bm.education.models.Lesson;
import com.bm.education.models.ModuleStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bm.education.models.Module;
import org.springframework.data.jpa.repository.Modifying;
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

    void deleteById(Integer id);

    @Modifying
    @Transactional
    @Query(value = "UPDATE modules SET status = :status WHERE id = :id", nativeQuery = true)
    void updateStatusById(@Param("id") Integer id, @Param("status") String status);
    Optional<Module> findBySlug(String slug);
}
