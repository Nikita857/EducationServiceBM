package com.bm.education.repositories;

import com.bm.education.models.ModuleTestResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModuleTestResultRepository extends JpaRepository<ModuleTestResult, Long> {
    Long countByUserId(Long userId);
}
