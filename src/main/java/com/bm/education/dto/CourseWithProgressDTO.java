package com.bm.education.dto;

public record CourseWithProgressDTO(
        Long id,
        String title,
        String image,
        String description,
        String slug,
        Long progress) {
}