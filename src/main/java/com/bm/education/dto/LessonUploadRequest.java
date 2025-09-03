package com.bm.education.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class LessonUploadRequest {
    @NotNull(message = "Файл обязателен")
    private MultipartFile file;

    @NotBlank(message = "Название урока обязательно")
    @Size(max = 100, message = "Название урока не должно превышать 100 символов")
    private String title;

    @NotNull(message = "ID модуля обязателен")
    private Integer moduleId;

    @Size(max = 5000, message = "Описание не должно превышать 5000 символов")
    private String description;

    @NotBlank(message = "Краткое описание обязательно")
    @Size(max = 50, message = "Краткое описание не должно превышать 50 символов")
    private String shortDescription;

    private String testCode;
}
