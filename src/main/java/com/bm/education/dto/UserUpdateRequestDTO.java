package com.bm.education.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequestDTO {
    @NotNull
    private Integer userId;

    @NotBlank(message = "Поле отдел не может быть пустым")
    @Size(message = "Поле отдел должно быть от 2 до 50 символов", min = 2, max = 50)
    private String department;

    @NotBlank(message = "Поле должность не может быть пустым")
    @Size(message = "Поле должность должно быть от 2 до 50 символов", min = 2, max = 50)
    private String jobTitle;

    @NotBlank(message = "Поле квалификация не может быть пустым")
    @Size(min = 1, max = 50)
    private String qualification;

    private String role;

}
