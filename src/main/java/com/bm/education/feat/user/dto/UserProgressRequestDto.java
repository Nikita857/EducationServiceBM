package com.bm.education.feat.user.dto;

import jakarta.validation.constraints.NotNull;

public record UserProgressRequestDto(
        @NotNull Long userId,

        @NotNull Long lessonId,

        @NotNull Long moduleId,

        @NotNull Long courseId) {
}