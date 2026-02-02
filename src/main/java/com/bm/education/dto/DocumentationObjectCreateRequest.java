package com.bm.education.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public record DocumentationObjectCreateRequest(
        @NotBlank(message = "Название документа не может быть пустым") @Size(max = 255, message = "Название документа не может превышать 255 символов") String name,

        List<String> tags,

        @NotNull(message = "Категория не может быть пустой") Long categoryId,

        MultipartFile file,

        String textContent) {
}
