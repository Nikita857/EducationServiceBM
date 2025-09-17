package com.bm.education.dto;

import lombok.Data;

/**
 * Data transfer object for a course with progress.
 */
@Data
public class CourseWithProgressDTO {

    /**
     * The ID of the course.
     */
    private Integer id;

    /**
     * The title of the course.
     */
    private String title;

    /**
     * The image of the course.
     */
    private String image;

    /**
     * The description of the course.
     */
    private String description;

    /**
     * The slug of the course.
     */
    private String slug;

    /**
     * The progress of the user in the course.
     */
    private Integer progress;
}