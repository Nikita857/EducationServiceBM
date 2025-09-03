package com.bm.education.dto;

import lombok.Data;

@Data
public class CreateLessonDTO {
    private String title;
    private String video;
    private String description;
    private String shortDescription;
    private String testCode;
    private Integer moduleId;
}
