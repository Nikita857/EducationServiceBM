package com.bm.education.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
public class ViewModuleDto {
    private Integer id;
    private String title;
    private String shortDescription;
    private String moduleTitle;
    private String courseTitle;
    private Integer completed;
    private LocalDateTime completedAt;
    private String formattedCompletedDate;

    public ViewModuleDto(Integer id, String title, String shortDescription,
                                 String moduleTitle, String courseTitle,
                                 Integer completed, LocalDateTime completedAt) {
        this.id = id;
        this.title = title;
        this.shortDescription = shortDescription;
        this.moduleTitle = moduleTitle;
        this.courseTitle = courseTitle;
        this.completed = completed;
        this.completedAt = completedAt;

        if (completedAt != null) {
            this.formattedCompletedDate = completedAt.format(
                    DateTimeFormatter.ofPattern("yyyy-MM-dd")
            );
        }
    }

    public String getFormattedCompletedDate() {
        if (formattedCompletedDate != null) {
            return formattedCompletedDate;
        }
        if (completedAt != null) {
            return completedAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        }
        return null;
    }
}
