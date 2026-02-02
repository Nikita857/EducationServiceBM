package com.bm.education.feat.module.repository;

import com.bm.education.feat.module.model.ModuleStatus;
import jakarta.transaction.Transactional;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bm.education.feat.module.model.Module;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    @Query("SELECT m FROM Module m JOIN FETCH m.course")
    List<Module> findAllWithCourse();

    @Query("SELECT m FROM Module m JOIN FETCH m.course WHERE m.course.id = :courseId AND m.status = 'ACTIVE'")
    List<Module> getModulesByCourseId(@Param("courseId") Long courseId);

    Optional<Module> getModuleBySlugAndStatus(String slug, ModuleStatus status);

    @NotNull
    Optional<Module> findById(@NotNull Long id);

    @NotNull
    List<Module> findAll();

    void deleteById(@NotNull Long id);

    @Modifying
    @Transactional
    @Query(value = "UPDATE modules SET status = :status WHERE id = :id", nativeQuery = true)
    void updateStatusById(@Param("id") Long id, @Param("status") String status);

    Optional<Module> findBySlug(String slug);

    Page<Module> findAllByCourse_Id(Long courseId, org.springframework.data.domain.Pageable pageable);

    long count();
}