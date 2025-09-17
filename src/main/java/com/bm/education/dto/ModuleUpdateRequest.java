package com.bm.education.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Data transfer object for a module update request.
 */
@Data
public class ModuleUpdateRequest {
    /**
     * The ID of the module.
     */
    @NotNull
    private Integer moduleId;

    /**
     * The name of the module.
     */
    @NotNull
    @Size(min = 3, max = 100)
    private String name;

    /**
     * The slug of the module.
     */
    @NotNull
    @Size(min = 3, max = 50)
    private String slug;

    /**
     * The ID of the course the module belongs to.
     */
    @NotNull
    private Integer courseId;
}