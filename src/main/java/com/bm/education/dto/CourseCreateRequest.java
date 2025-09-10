package com.bm.education.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CourseCreateRequest {

    @NotBlank(message = "Название курса обязательно")
    @Size(min = 2, max = 255, message = "Название не должно превышать 255 символов")
    private String title;

    @NotBlank(message = "URL-адрес обязателен")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "URL может содержать только латинские буквы, цифры и дефисы")
    @Size(max = 100, message = "URL не должен превышать 100 символов")
    private String slug;

    @NotBlank(message = "Описание обязательно")
    @Size(min = 50, max = 255, message = "Описание должно содержать от 50 до 255 символов")
    private String description;

    private MultipartFile image;
}