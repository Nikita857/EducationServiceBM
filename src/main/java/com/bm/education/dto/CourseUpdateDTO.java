package com.bm.education.dto;

import lombok.Data;

/**
 * Data transfer object for updating a course.
 */
@Data
public class CourseUpdateDTO {
    /**
     * The ID of the course.
     */
    private Integer id;

    /**
     * The image of the course.
     */
    private String image;

    /**
     * The title of the course.
     */
    private String title;

    /**
     * The description of the course.
     */
    private String description;

    /**
     * The slug of the course.
     */
    private String slug;
}