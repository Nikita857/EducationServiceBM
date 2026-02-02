package com.bm.education.feat.documentation.dto;

public record DocumentationObjectDTO(
        Long id,
        String name,
        String tags,
        String file,
        String categoryName,
        String courseName) {
}
