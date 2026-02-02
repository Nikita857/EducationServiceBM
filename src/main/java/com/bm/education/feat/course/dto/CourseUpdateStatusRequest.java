package com.bm.education.feat.course.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CourseUpdateStatusRequest(
        @NotNull(message = "ID не может быть пустым") Long courseId,

        @NotBlank(message = "Статус не может быть пустым") String status) {
}