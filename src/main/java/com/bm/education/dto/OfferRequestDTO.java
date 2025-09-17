package com.bm.education.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Data transfer object for an offer request.
 */
@Data
public class OfferRequestDTO {
    /**
     * The ID of the offer.
     */
    private Integer id;
    /**
     * The ID of the user who created the offer.
     */
    private Integer userId;
    /**
     * The full name of the user who created the offer.
     */
    private String fio;
    /**
     * The topic of the offer.
     */
    private String topic;
    /**
     * The description of the offer.
     */
    private String description;
    /**
     * The response to the offer.
     */
    private String response;
    /**
     * The status of the offer.
     */
    private String status;

    /**
     * The creation date of the offer.
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    /**
     * The last update date of the offer.
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    /**
     * Constructs a new OfferRequestDTO object.
     *
     * @param id The ID of the offer.
     * @param userId The ID of the user who created the offer.
     * @param fio The full name of the user who created the offer.
     * @param topic The topic of the offer.
     * @param description The description of the offer.
     * @param response The response to the offer.
     * @param status The status of the offer.
     * @param createdAt The creation date of the offer.
     * @param updatedAt The last update date of the offer.
     */
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