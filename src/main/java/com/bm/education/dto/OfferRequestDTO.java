package com.bm.education.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.Instant;
import java.time.LocalDateTime;

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