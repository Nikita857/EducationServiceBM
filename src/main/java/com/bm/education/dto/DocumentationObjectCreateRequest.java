package com.bm.education.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
public class DocumentationObjectCreateRequest {
    @NotBlank(message = "Название документа не может быть пустым")
    @Size(max = 255, message = "Название документа не может превышать 255 символов")
    private String name;

    private java.util.List<String> tags; // Optional

    @NotNull(message = "Категория не может быть пустой")
    private Long categoryId;

    private MultipartFile file; // For file upload

    private String textContent; // For TinyMCE content
}
