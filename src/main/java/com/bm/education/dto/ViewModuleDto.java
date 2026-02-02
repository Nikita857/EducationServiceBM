package com.bm.education.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public record ViewModuleDto(
        Long id,
        String title,
        String shortDescription,
        String moduleTitle,
        String courseTitle,
        Long completed,
        LocalDateTime completedAt) {
    public String formattedCompletedDate() {
        if (completedAt != null) {
            return completedAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        }
        return null;
    }
}