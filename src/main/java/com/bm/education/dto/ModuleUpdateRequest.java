package com.bm.education.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ModuleUpdateRequest {
    @NotNull
    private Integer moduleId;

    @NotNull
    @Size(min = 3, max = 100)
    private String name;

    @NotNull
    @Size(min = 3, max = 50)
    private String slug;

    @NotNull
    private Integer courseId;
}
