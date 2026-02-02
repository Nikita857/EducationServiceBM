package com.bm.education.feat.course.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

public record CourseUpdateRequest(
                @NotNull Long id,

                MultipartFile image,

                @NotBlank(message = "Загловок не может быть пустым") @Size(min = 2, max = 100, message = "Длина заголовка должна быть в пределах 2-100 символов") String title,

                @NotBlank(message = "Описание не может быть пустым") @Size(min = 2, max = 5000, message = "Длина описания должна быть в пределах 2-5000 символов") String description,

                @Size(max = 500, message = "Краткое описание до 500 символов") String shortDescription,

                String difficulty,

                Integer estimatedDuration,

                Long categoryId,

                @NotBlank(message = "URI не может быть пустым") @Size(min = 2, max = 100, message = "Длина URI должна быть в пределах 2-100 символов") String slug) {
}