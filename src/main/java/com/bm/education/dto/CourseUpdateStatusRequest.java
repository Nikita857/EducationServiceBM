package com.bm.education.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Data transfer object for a course status update request.
 */
@Data
public class CourseUpdateStatusRequest {
    /**
     * The ID of the course.
     */
    @NotNull(message = "ID не может быть пустым")
    Integer courseId;
    /**
     * The new status of the course.
     */
    @NotBlank(message = "Статус не может быть пустым")
    String status;
}