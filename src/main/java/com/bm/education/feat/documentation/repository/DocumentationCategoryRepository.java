package com.bm.education.feat.documentation.repository;

import com.bm.education.feat.documentation.model.DocumentationCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

import com.bm.education.feat.documentation.dto.DocumentationCategoryDTO;

public interface DocumentationCategoryRepository extends JpaRepository<DocumentationCategory, Long> {
    @Query("SELECT c FROM DocumentationCategory c LEFT JOIN FETCH c.documentationObjects LEFT JOIN FETCH c.documentation d LEFT JOIN FETCH d.course WHERE c.slug = :slug")
    Optional<DocumentationCategory> findBySlugWithObjects(@Param("slug") String slug);

    @Query("SELECT c FROM DocumentationCategory c LEFT JOIN FETCH c.documentation d LEFT JOIN FETCH d.course")
    List<DocumentationCategory> findAllWithCourseData();

    @Query("SELECT c FROM DocumentationCategory c LEFT JOIN FETCH c.documentation d LEFT JOIN FETCH d.course WHERE lower(c.name) LIKE lower(concat('%', :name, '%'))")
    List<DocumentationCategory> findByNameContainingIgnoreCaseWithCourseData(@Param("name") String name);

    @Query("SELECT new com.bm.education.dto.DocumentationCategoryDTO(c.id, c.name) FROM DocumentationCategory c")
    List<DocumentationCategoryDTO> findAllProjectedToDto();

    @Query("SELECT new com.bm.education.dto.DocumentationCategoryDTO(c.id, c.name) FROM DocumentationCategory c WHERE c.documentation.course.id = :courseId")
    List<DocumentationCategoryDTO> findAllProjectedToDtoByCourseId(@Param("courseId") Long courseId);
}
