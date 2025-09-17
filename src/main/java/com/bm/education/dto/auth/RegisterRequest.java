package com.bm.education.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Поле Имя не может быть пустым")
    @Size(min = 2, max = 40, message = "Поле Имя должно быть от 2 до 40 символов")
    private String firstName;
    @NotBlank(message = "Поле Фамилия не может быть пустым")
    @Size(min = 2, max = 40, message = "Поле Фамилия должно быть от 2 до 40 символов")
    private String lastName;
    @NotBlank(message = "Поле Отдел не может быть пустым")
    @Size(min = 2, max = 60, message = "Поле Отдел должно быть от 2 до 60 символов")
    private String department;
    @NotBlank(message = "Поле Должность не может быть пустым")
    @Size(min = 2, max = 60, message = "Поле Должность должно быть от 2 до 60 символов")
    private String jobTitle;
    @NotBlank(message = "Поле Логин не может быть пустым")
    @Size(min = 2, max = 60, message = "Поле Логин должно быть от 2 до 60 символов")
    private String username;
    @NotBlank(message = "Поле Пароль не может быть пустым")
    @Size(min = 8, max = 20, message = "Поле Имя должно быть от 8 до 20 символов")
    private String password;
}
