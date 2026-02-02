package com.bm.education.feat.course.dto;

public record CourseResponseDTO(
        Long id,
        String title,
        String image,
        String description,
        String slug,
        String status,
        String createdAt,
        String updatedAt) {
}