package com.bm.education.feat.course.dto;

public record CourseWithProgressDTO(
        Long id,
        String title,
        String image,
        String description,
        String slug,
        Long progress) {
}