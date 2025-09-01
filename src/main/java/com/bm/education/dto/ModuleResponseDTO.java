package com.bm.education.dto;

import lombok.Data;

@Data
public class ModuleResponseDTO {
    private int moduleId;
    private String courseName;
    private String moduleTitle;
    private String moduleSlug;
    private String moduleStatus;

    public ModuleResponseDTO(int moduleId, String courseName, String moduleTitle, String moduleSlug, String moduleStatus) {
        this.moduleId = moduleId;
        this.courseName = courseName;
        this.moduleTitle = moduleTitle;
        this.moduleSlug = moduleSlug;
        this.moduleStatus = moduleStatus;
    }
}
