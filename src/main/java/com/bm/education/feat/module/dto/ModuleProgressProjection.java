package com.bm.education.feat.module.dto;

/**
 * Projection for module with lesson progress stats.
 * Used for optimized single-query retrieval of module data with progress.
 */
public record ModuleProgressProjection(
        Long moduleId,
        String title,
        String slug,
        String shortDescription,
        Integer displayOrder,
        Long totalLessons,
        Long completedLessons,
        boolean testPassed) {
    /**
     * Check if all lessons in the module are completed.
     */
    public boolean isLessonsCompleted() {
        return totalLessons == 0 || totalLessons.equals(completedLessons);
    }
}
