package com.bm.education.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

/**
 * Data transfer object for a course update request.
 */
@Data
public class CourseUpdateRequest {
    /**
     * The ID of the course.
     */
    @NotNull
    private Integer id;

    /**
     * The image of the course.
     */
    private MultipartFile image;

    /**
     * The title of the course.
     */
    @NotBlank(message = "Загловок не может быть пустым")
    @Size(min = 2, max = 100, message = "Длина заголовка должна быть в пределах 2-100 символов")
    private String title;

    /**
     * The description of the course.
     */
    @NotBlank(message = "Описание не может быть пустым")
    @Size(min = 2, max = 100, message = "Длина описания должна быть в пределах 2-100 символов")
    private String description;

    /**
     * The slug of the course.
     */
    @NotBlank(message = "URI не может быть пустым")
    @Size(min = 2, max = 100, message = "Длина URI должна быть в пределах 2-100 символов")
    private String slug;
}