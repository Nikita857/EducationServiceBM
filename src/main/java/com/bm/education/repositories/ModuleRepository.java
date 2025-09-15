package com.bm.education.repositories;

import com.bm.education.models.ModuleStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    @Query("SELECT m FROM Module m JOIN FETCH m.course")
    List<Module> findAllWithCourse();

    @Query("SELECT m FROM Module m JOIN FETCH m.course WHERE m.course.id = :courseId AND m.status = 'ACTIVE'")
    List<Module> getModulesByCourseId(@Param("courseId") Integer courseId);

    Optional<Module> getModuleBySlugAndStatus(String slug, ModuleStatus status);
    Optional<Module> findById(Integer id);

    List<Module> findAll();

    void deleteById(Integer id);

    @Modifying
    @Transactional
    @Query(value = "UPDATE modules SET status = :status WHERE id = :id", nativeQuery = true)
    void updateStatusById(@Param("id") Integer id, @Param("status") String status);

    Optional<Module> findBySlug(String slug);

    Page<Module> findAllByCourse_Id(Integer courseId, org.springframework.data.domain.Pageable pageable);
    long count();
}