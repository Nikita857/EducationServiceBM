package com.bm.education.feat.documentation.repository;

import com.bm.education.feat.documentation.model.DocumentationObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface DocumentationObjectRepository extends JpaRepository<DocumentationObject, Long> {

    @Query(value = "SELECT DISTINCT do FROM DocumentationObject do " +
           "LEFT JOIN FETCH do.category c " +
           "LEFT JOIN FETCH do.tags t " +
           "LEFT JOIN c.documentation d " +
           "LEFT JOIN d.course course " +
           "WHERE (:courseId IS NULL OR course.id = :courseId) " +
           "AND (:categoryId IS NULL OR c.id = :categoryId)",
           countQuery = "SELECT count(DISTINCT do) FROM DocumentationObject do " +
                        "LEFT JOIN do.category c " +
                        "LEFT JOIN c.documentation d " +
                        "WHERE (:courseId IS NULL OR d.course.id = :courseId) " +
                        "AND (:categoryId IS NULL OR c.id = :categoryId)")
    Page<DocumentationObject> findByFilters(Pageable pageable, @Param("courseId") Integer courseId, @Param("categoryId") Long categoryId);

    @Query("SELECT do FROM DocumentationObject do JOIN do.tags t WHERE do.category.slug = :slug AND t.name = :tagName")
    List<DocumentationObject> findByCategorySlugAndTagName(@Param("slug") String slug, @Param("tagName") String tagName);
}