package com.bm.education.dto;

import lombok.Data;

/**
 * Data transfer object for creating a lesson.
 */
@Data
public class CreateLessonDTO {
    /**
     * The title of the lesson.
     */
    private String title;
    /**
     * The video URL of the lesson.
     */
    private String video;
    /**
     * The description of the lesson.
     */
    private String description;
    /**
     * The short description of the lesson.
     */
    private String shortDescription;
    /**
     * The test code of the lesson.
     */
    private String testCode;
    /**
     * The ID of the module the lesson belongs to.
     */
    private Integer moduleId;
    private Long contentLength;
}