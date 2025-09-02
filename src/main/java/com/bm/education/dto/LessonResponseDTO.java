package com.bm.education.dto;

import lombok.Data;

@Data
public class LessonResponseDTO {

    private Integer id;

    private String moduleName;

    private String title;

    private String video;

    private String description;

    private String shortDescription;

    private String testCode;

}
