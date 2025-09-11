package com.bm.education.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CourseUpdateStatusRequest {
    @NotNull(message = "ID не может быть пустым")
    Integer courseId;
    @NotBlank(message = "Статус не может быть пустым")
    String status;
}
