package com.bm.education.feat.offer.dto;

import com.bm.education.feat.offer.model.OfferStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record OfferResponseDto(
        @NotNull(message = "ID заявки обязателен") Long offerId,

        @NotNull(message = "Статус обязателен") OfferStatus status,

        @Size(max = 2000, message = "Ответ не может превышать 2000 символов") String response) {
}