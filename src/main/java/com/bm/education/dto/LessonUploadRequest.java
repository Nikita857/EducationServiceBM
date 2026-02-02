package com.bm.education.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

public record LessonUploadRequest(
        @NotNull(message = "Файл обязателен") MultipartFile file,

        @NotBlank(message = "Название урока обязательно") @Size(max = 100, message = "Название урока не должно превышать 100 символов") String title,

        @NotNull(message = "ID модуля обязателен") Long moduleId,

        @Size(max = 5000, message = "Описание не должно превышать 5000 символов") String description,

        @NotBlank(message = "Краткое описание обязательно") @Size(max = 50, message = "Краткое описание не должно превышать 50 символов") String shortDescription,

        String testCode) {
}