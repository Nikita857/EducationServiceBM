package com.bm.education.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OfferDto {
    @NotNull(message = "User ID is required")
    private Integer userId;

    @NotBlank(message = "Поле тема не может быть пустым")
    @Size(min = 2, max = 50, message = "Поле тема не может быть меньше 2 и больше 50 символов")
    private String topic;

    @NotBlank(message = "Описание не может быть пустым")
    @Size(min = 50, max = 2000, message = "Описание не может быть менее 50 и более 2000 символов")
    private String description;

    // Не добавляйте createdAt и status в DTO -
    // они устанавливаются автоматически на сервере
}
