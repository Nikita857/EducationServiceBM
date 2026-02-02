package com.bm.education.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ModuleUpdateRequest(
        @NotNull Long moduleId,

        @NotNull @Size(min = 3, max = 100) String name,

        @NotNull @Size(min = 3, max = 50) String slug,

        @NotNull Long courseId) {
}