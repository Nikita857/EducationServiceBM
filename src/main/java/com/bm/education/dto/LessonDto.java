package com.bm.education.dto;

import lombok.Data;

/**
 * Data transfer object for a lesson.
 */
@Data
public class LessonDto {
    /**
     * The title of the lesson.
     */
    private String title;
    /**
     * The text content of the lesson.
     */
    private String textContent;
    /**
     * The video URL of the lesson.
     */
    private String videoUrl;
}