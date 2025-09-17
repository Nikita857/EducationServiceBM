package com.bm.education.dto;

import lombok.Data;

/**
 * Data transfer object for a course response.
 */
@Data
public class CourseResponseDTO {

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
     * The status of the course.
     */
    private String status;

    /**
     * The creation date of the course.
     */
    private String createdAt;

    /**
     * The last update date of the course.
     */
    private String updatedAt;

    /**
     * Constructs a new CourseResponseDTO object.
     *
     * @param id The ID of the course.
     * @param title The title of the course.
     * @param image The image of the course.
     * @param description The description of the course.
     * @param slug The slug of the course.
     * @param status The status of the course.
     * @param createdAt The creation date of the course.
     * @param updatedAt The last update date of the course.
     */
    public CourseResponseDTO(Integer id, String title, String image, String description, String slug, String status, String createdAt, String updatedAt) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.description = description;
        this.slug = slug;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}