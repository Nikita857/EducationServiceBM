package com.bm.education.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ModuleCreateRequest {
    @NotNull
    private Integer courseId;

    @NotBlank(message = "Поле URI не может быть пустым")
    @Size(min = 2, max = 50, message = "Поле URI не может содержать больше 50 символов")
    private String slug;

    @NotBlank(message = "Поле title не может быть пустым")
    @Size(min = 2, max = 100, message = "Поле title не может содержать больше 100 символов")
    private String title;
}
