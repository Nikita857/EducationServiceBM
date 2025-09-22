package com.bm.education.repositories;

import com.bm.education.models.DocumentationObject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentationObjectRepository extends JpaRepository<DocumentationObject, Long> {
    List<DocumentationObject> findByCategoryId(long category);
}
