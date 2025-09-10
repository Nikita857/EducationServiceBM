package com.bm.education.dto;

import lombok.Data;

@Data
public class CourseUpdateDTO {
    private Integer id;

    private String image;

    private String title;

    private String description;

    private String slug;
}
