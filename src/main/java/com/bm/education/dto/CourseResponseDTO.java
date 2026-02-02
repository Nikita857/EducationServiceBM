package com.bm.education.dto;

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