package com.bm.education.feat.course.dto;

import com.bm.education.feat.course.model.CourseDifficulty;

public record CourseResponse(
        Long id,
        String title,
        String image,
        String description,
        String slug,
        String status,
        String createdAt,
        String updatedAt,
        String shortDescription,
        CourseDifficulty difficulty,
        Integer estimatedDuration,
        CategoryResponse category) {
}