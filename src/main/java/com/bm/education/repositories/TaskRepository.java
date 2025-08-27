package com.bm.education.repositories;

import com.bm.education.dto.ViewModuleDto;
import com.bm.education.models.Tasks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Tasks, Integer> {
    List<Tasks> getTasksByModuleId(int moduleId);

    @Query(value = "SELECT l.id, l.title, l.short_description, m.title as module_title, c.title as course_title, " +
            "CASE WHEN up.id IS NOT NULL THEN true ELSE false END as completed, up.completed_at " +
            "FROM lessons l INNER JOIN modules m ON l.module_id = m.id INNER JOIN courses c ON m.course_id = c.id " +
            "LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = :userId WHERE m.id = :moduleId ORDER BY l.id;", nativeQuery = true)
    List<Object[]> findLessonsByModuleAndUserId(@Param("moduleId") Integer moduleId, @Param("userId") Integer userId);
}
