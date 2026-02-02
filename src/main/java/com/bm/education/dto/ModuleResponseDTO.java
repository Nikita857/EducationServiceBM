package com.bm.education.dto;

public record ModuleResponseDTO(
        Long moduleId,
        String courseName,
        String moduleSlug,
        String moduleTitle,
        String moduleStatus,
        boolean lessonsCompleted,
        boolean testPassed) {
}