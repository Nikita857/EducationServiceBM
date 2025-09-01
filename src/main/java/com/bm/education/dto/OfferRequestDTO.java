package com.bm.education.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OfferRequestDTO {
    private Integer id;
    private Integer userId;
    private String fio;
    private String topic;
    private String description;
    private String response;
    private String status;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    public OfferRequestDTO(Integer id, Integer userId, String fio, String topic,
                           String description, String response, String status,
                           LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.fio = fio;
        this.topic = topic;
        this.description = description;
        this.response = response;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

}