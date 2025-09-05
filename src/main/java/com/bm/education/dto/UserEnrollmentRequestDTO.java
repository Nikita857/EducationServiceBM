package com.bm.education.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserEnrollmentRequestDTO {
    @NotNull
    private Integer userId;

    @NotNull
    private Integer courseId;
}