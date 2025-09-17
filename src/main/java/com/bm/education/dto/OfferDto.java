package com.bm.education.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Data transfer object for an offer.
 */
@Data
public class OfferDto {
    /**
     * The ID of the user who created the offer.
     */
    @NotNull(message = "User ID is required")
    private Integer userId;

    /**
     * The topic of the offer.
     */
    @NotBlank(message = "Поле тема не может быть пустым")
    @Size(min = 2, max = 50, message = "Поле тема не может быть меньше 2 и больше 50 символов")
    private String topic;

    /**
     * The description of the offer.
     */
    @NotBlank(message = "Описание не может быть пустым")
    @Size(min = 50, max = 2000, message = "Описание не может быть менее 50 и более 2000 символов")
    private String description;
}