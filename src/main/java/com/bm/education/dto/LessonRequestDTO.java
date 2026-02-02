package com.bm.education.dto;

public record LessonRequestDTO(
        Long id,
        String title,
        String moduleName,
        String moduleSlug,
        String courseSlug) {
}