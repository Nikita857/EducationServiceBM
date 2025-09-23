package com.bm.education.repositories;

import com.bm.education.dto.DocumentationObjectDTO;
import com.bm.education.models.DocumentationObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DocumentationObjectRepository extends JpaRepository<DocumentationObject, Long> {

    @Query("SELECT new com.bm.education.dto.DocumentationObjectDTO(do.id, do.name, do.tags, do.file, c.name, course.title) " +
           "FROM DocumentationObject do " +
           "JOIN do.category c " +
           "JOIN c.documentation d " +
           "LEFT JOIN d.course course " +
           "WHERE (:courseId IS NULL OR (d.course IS NOT NULL AND d.course.id = :courseId)) " +
           "AND (:categoryId IS NULL OR c.id = :categoryId)")
    Page<DocumentationObjectDTO> findByFilters(Pageable pageable, @Param("courseId") Integer courseId, @Param("categoryId") Long categoryId);
}