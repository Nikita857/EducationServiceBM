package com.bm.education.feat.lesson.dto;

public record LessonListResponse(
        Long id,
        String title,
        String moduleName,
        String moduleSlug,
        String courseSlug) {
}
