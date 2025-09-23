package com.bm.education.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DocumentationObjectDTO {
    private Long id;
    private String name;
    private String tags;
    private String file;
    private String categoryName;
    private String courseName;
}
