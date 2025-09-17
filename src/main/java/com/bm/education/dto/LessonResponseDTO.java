package com.bm.education.dto;

import lombok.Data;

/**
 * Data transfer object for a lesson response.
 */
@Data
public class LessonResponseDTO {

    /**
     * The ID of the lesson.
     */
    private Integer id;

    /**
     * The name of the module the lesson belongs to.
     */
    private String moduleName;

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

}