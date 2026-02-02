package com.bm.education.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Поле Имя не может быть пустым") @Size(min = 2, max = 40, message = "Поле Имя должно быть от 2 до 40 символов") String firstName,

        @NotBlank(message = "Поле Фамилия не может быть пустым") @Size(min = 2, max = 40, message = "Поле Фамилия должно быть от 2 до 40 символов") String lastName,

        @NotBlank(message = "Поле Отдел не может быть пустым") @Size(min = 2, max = 60, message = "Поле Отдел должно быть от 2 до 60 символов") String department,

        @NotBlank(message = "Поле Должность не может быть пустым") @Size(min = 2, max = 60, message = "Поле Должность должно быть от 2 до 60 символов") String jobTitle,

        @NotBlank(message = "Поле Логин не может быть пустым") @Size(min = 2, max = 60, message = "Поле Логин должно быть от 2 до 60 символов") String username,

        @NotBlank(message = "Поле Пароль не может быть пустым") @Size(min = 8, max = 20, message = "Поле Имя должно быть от 8 до 20 символов") String password) {
}
