package com.bm.education.feat.course.dto;

public record CourseWithProgress(
                Long id,
                String title,
                String image,
                String description,
                String slug,
                Long progress) {
}