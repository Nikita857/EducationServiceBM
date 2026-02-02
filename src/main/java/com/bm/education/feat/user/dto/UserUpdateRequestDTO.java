package com.bm.education.feat.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserUpdateRequestDTO(
        @NotNull Long userId,

        @NotBlank(message = "Поле отдел не может быть пустым") @Size(message = "Поле отдел должно быть от 2 до 50 символов", min = 2, max = 50) String department,

        @NotBlank(message = "Поле должность не может быть пустым") @Size(message = "Поле должность должно быть от 2 до 50 символов", min = 2, max = 50) String jobTitle,

        @NotBlank(message = "Поле квалификация не может быть пустым") @Size(min = 1, max = 50) String qualification,

        String role) {
}