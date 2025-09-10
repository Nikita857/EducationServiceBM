package com.bm.education.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CourseUpdateRequest {
    @NotNull
    private Integer id;

    private MultipartFile image;

    @NotBlank(message = "Загловок не может быть пустым")
    @Size(min = 2, max = 100, message = "Длина заголовка должна быть в пределах 2-100 символов")
    private String title;

    @NotBlank(message = "Описание не может быть пустым")
    @Size(min = 2, max = 100, message = "Длина описания должна быть в пределах 2-100 символов")
    private String description;

    @NotBlank(message = "URI не может быть пустым")
    @Size(min = 2, max = 100, message = "Длина URI должна быть в пределах 2-100 символов")
    private String slug;
}
