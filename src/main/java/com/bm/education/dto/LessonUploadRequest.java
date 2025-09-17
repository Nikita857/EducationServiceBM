package com.bm.education.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

/**
 * Data transfer object for a lesson upload request.
 */
@Data
public class LessonUploadRequest {
    /**
     * The video file of the lesson.
     */
    @NotNull(message = "Файл обязателен")
    private MultipartFile file;

    /**
     * The title of the lesson.
     */
    @NotBlank(message = "Название урока обязательно")
    @Size(max = 100, message = "Название урока не должно превышать 100 символов")
    private String title;

    /**
     * The ID of the module the lesson belongs to.
     */
    @NotNull(message = "ID модуля обязателен")
    private Integer moduleId;

    /**
     * The description of the lesson.
     */
    @Size(max = 5000, message = "Описание не должно превышать 5000 символов")
    private String description;

    /**
     * The short description of the lesson.
     */
    @NotBlank(message = "Краткое описание обязательно")
    @Size(max = 50, message = "Краткое описание не должно превышать 50 символов")
    private String shortDescription;

    /**
     * The test code of the lesson.
     */
    private String testCode;
}