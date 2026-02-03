package com.bm.education.feat.module.dto;

/**
 * Response DTO for public module details.
 */
public record ModuleDetailsResponse(
        Long id,
        String title,
        String slug,
        String shortDescription,
        String courseTitle,
        String courseSlug,
        boolean lessonsCompleted) {
}
