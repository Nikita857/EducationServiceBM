package com.bm.education.dto;

import com.bm.education.models.OfferStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Data transfer object for an offer response.
 */
@Data
public class OfferResponseDto {
    /**
     * The ID of the offer.
     */
    @NotNull(message = "ID заявки обязателен")
    private Integer offerId;

    /**
     * The status of the offer.
     */
    @NotNull(message = "Статус обязателен")
    private OfferStatus status;

    /**
     * The response to the offer.
     */
    @Size(max = 2000, message = "Ответ не может превышать 2000 символов")
    private String response;
}