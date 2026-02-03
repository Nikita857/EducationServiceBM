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

    /**
     * Optimized query to get modules with progress stats in a single query.
     * Returns module data with total lessons, completed lessons, and test status.
     */
    @Query(value = """
            SELECT
                m.id as moduleId,
                m.title as title,
                m.slug as slug,
                m.short_description as shortDescription,
                m.display_order as displayOrder,
                COALESCE(lesson_counts.total, 0) as totalLessons,
                COALESCE(progress_counts.completed, 0) as completedLessons,
                CASE WHEN umc.id IS NOT NULL THEN true ELSE false END as testPassed
            FROM modules m
            LEFT JOIN (
                SELECT l.module_id, COUNT(*) as total
                FROM lessons l
                GROUP BY l.module_id
            ) lesson_counts ON lesson_counts.module_id = m.id
            LEFT JOIN (
                SELECT up.module_id, COUNT(*) as completed
                FROM user_progress up
                WHERE up.user_id = :userId
                GROUP BY up.module_id
            ) progress_counts ON progress_counts.module_id = m.id
            LEFT JOIN user_module_completions umc ON umc.module_id = m.id AND umc.user_id = :userId
            WHERE m.course_id = :courseId AND m.status = 'ACTIVE'
            ORDER BY m.display_order ASC
            """, nativeQuery = true)
    List<Object[]> findModulesWithProgress(@Param("courseId") Long courseId, @Param("userId") Long userId);
}