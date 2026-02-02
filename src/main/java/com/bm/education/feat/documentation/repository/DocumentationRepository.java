package com.bm.education.feat.documentation.repository;

import com.bm.education.feat.documentation.model.Documentation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentationRepository extends JpaRepository<Documentation, Long> {
    List<Documentation> findByTitleContainingIgnoreCase(String title);
}
