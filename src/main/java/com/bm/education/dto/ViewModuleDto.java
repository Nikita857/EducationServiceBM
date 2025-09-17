package com.bm.education.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Data transfer object for a module view.
 */
@Data
public class ViewModuleDto {
    /**
     * The ID of the lesson.
     */
    private Integer id;
    /**
     * The title of the lesson.
     */
    private String title;
    /**
     * The short description of the lesson.
     */
    private String shortDescription;
    /**
     * The title of the module.
     */
    private String moduleTitle;
    /**
     * The title of the course.
     */
    private String courseTitle;
    /**
     * Whether the lesson is completed.
     */
    private Integer completed;
    /**
     * The date the lesson was completed.
     */
    private LocalDateTime completedAt;
    /**
     * The formatted completion date of the lesson.
     */
    private String formattedCompletedDate;

    /**
     * Constructs a new ViewModuleDto object.
     *
     * @param id The ID of the lesson.
     * @param title The title of the lesson.
     * @param shortDescription The short description of the lesson.
     * @param moduleTitle The title of the module.
     * @param courseTitle The title of the course.
     * @param completed Whether the lesson is completed.
     * @param completedAt The date the lesson was completed.
     */
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

    /**
     * Gets the formatted completion date of the lesson.
     *
     * @return The formatted completion date of the lesson.
     */
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