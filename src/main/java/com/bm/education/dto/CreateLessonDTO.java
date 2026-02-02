package com.bm.education.dto;

public record CreateLessonDTO(
        String title,
        String video,
        String description,
        String shortDescription,
        String testCode,
        Long moduleId,
        Long contentLength) {
}