package com.bm.education.feat.offer.dto;

/**
 * Response DTO for submitted offers.
 */
public record OfferResponse(
        Long id,
        String topic,
        String description,
        String status) {
}
