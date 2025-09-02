package com.bm.education.dto;

import lombok.Data;

@Data
public class CourseWithProgressDTO {

    private Integer id;

    private String title;

    private String image;

    private String description;

    private String slug;

    private Integer progress;
}
