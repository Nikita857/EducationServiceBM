package com.bm.education.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Data transfer object for a user enrollment request.
 */
@Data
public class UserEnrollmentRequestDTO {
    /**
     * The ID of the user.
     */
    @NotNull
    private Integer userId;

    /**
     * The ID of the course.
     */
    @NotNull
    private Integer courseId;
}