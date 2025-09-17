package com.bm.education.dto;

import lombok.Data;

/**
 * Data transfer object for a module response.
 */
@Data
public class ModuleResponseDTO {
    /**
     * The ID of the module.
     */
    private int moduleId;
    /**
     * The name of the course the module belongs to.
     */
    private String courseName;
    /**
     * The title of the module.
     */
    private String moduleTitle;
    /**
     * The slug of the module.
     */
    private String moduleSlug;
    /**
     * The status of the module.
     */
    private String moduleStatus;

    /**
     * Constructs a new ModuleResponseDTO object.
     *
     * @param moduleId The ID of the module.
     * @param courseName The name of the course the module belongs to.
     * @param moduleTitle The title of the module.
     * @param moduleSlug The slug of the module.
     * @param moduleStatus The status of the module.
     */
    public ModuleResponseDTO(int moduleId, String courseName, String moduleTitle, String moduleSlug, String moduleStatus) {
        this.moduleId = moduleId;
        this.courseName = courseName;
        this.moduleTitle = moduleTitle;
        this.moduleSlug = moduleSlug;
        this.moduleStatus = moduleStatus;
    }
}