package com.bm.education.dto;

import lombok.Data;

@Data
public class LessonRequestDTO {
    Integer id;
    String title;
    String moduleName;
    String moduleSlug;
    String courseSlug;
}
