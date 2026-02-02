package com.bm.education.feat.user.dto;

import jakarta.validation.constraints.NotNull;

public record UserEnrollmentRequestDTO(
        @NotNull Long userId,

        @NotNull Long courseId) {
}