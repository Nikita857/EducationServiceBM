package com.bm.education.dto;

import com.bm.education.models.OfferStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OfferResponseDto {
    @NotNull(message = "ID заявки обязателен")
    private Integer offerId;

    @NotNull(message = "Статус обязателен")
    private OfferStatus status;

    @Size(max = 2000, message = "Ответ не может превышать 2000 символов")
    private String response;
}
