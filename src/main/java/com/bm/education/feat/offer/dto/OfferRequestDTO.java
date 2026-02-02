package com.bm.education.feat.offer.dto;

import java.time.Instant;

public record OfferRequestDTO(
        Long id,
        Long userId,
        String fio,
        String topic,
        String description,
        String response,
        String status,
        Instant createdAt,
        Instant updatedAt) {
}