package com.bm.education.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Data transfer object for a user update request.
 */
@Data
public class UserUpdateRequestDTO {
    /**
     * The ID of the user.
     */
    @NotNull
    private Integer userId;

    /**
     * The department of the user.
     */
    @NotBlank(message = "Поле отдел не может быть пустым")
    @Size(message = "Поле отдел должно быть от 2 до 50 символов", min = 2, max = 50)
    private String department;

    /**
     * The job title of the user.
     */
    @NotBlank(message = "Поле должность не может быть пустым")
    @Size(message = "Поле должность должно быть от 2 до 50 символов", min = 2, max = 50)
    private String jobTitle;

    /**
     * The qualification of the user.
     */
    @NotBlank(message = "Поле квалификация не может быть пустым")
    @Size(min = 1, max = 50)
    private String qualification;

    /**
     * The role of the user.
     */
    private String role;

}