package com.bm.education.feat.lesson.dto;

/**
 * DTO for lesson with user progress status.
 */
public record LessonWithProgress(
        Long id,
        String title,
        String moduleSlug,
        boolean completed) {
}
