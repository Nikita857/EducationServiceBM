package com.bm.education.repositories;

import com.bm.education.models.Documentation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentationRepository extends JpaRepository<Documentation, Long> {
    List<Documentation> findByTitleContainingIgnoreCase(String title);
}
