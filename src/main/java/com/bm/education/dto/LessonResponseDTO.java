package com.bm.education.dto;

public record LessonResponseDTO(
        Long id,
        String moduleName,
        String title,
        String video,
        String description,
        String shortDescription,
        String testCode) {
}