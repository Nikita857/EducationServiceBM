package com.bm.education.dto;

import jakarta.validation.constraints.NotNull;

public record UserEnrollmentRequestDTO(
        @NotNull Long userId,

        @NotNull Long courseId) {
}