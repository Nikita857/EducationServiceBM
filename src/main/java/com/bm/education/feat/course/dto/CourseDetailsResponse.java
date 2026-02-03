package com.bm.education.feat.course.dto;

import com.bm.education.feat.module.dto.ModuleResponse;

import java.util.List;
import java.util.Map;

/**
 * Response DTO for detailed course information with user progress.
 */
public record CourseDetailsResponse(
        Long id,
        String title,
        String slug,
        String shortDescription,
        String image,
        List<ModuleResponse> modules,
        Long totalLessons,
        Long completedLessons,
        int progressPercent,
        Map<Long, Boolean> completedModules) {
}
