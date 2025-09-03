package com.bm.education.dto;

import lombok.Data;

@Data
public class CourseResponseDTO {

    private Integer id;

    private String title;

    private String image;

    private String description;

    private String slug;

    private String status;

    private String createdAt;

    private String updatedAt;

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
