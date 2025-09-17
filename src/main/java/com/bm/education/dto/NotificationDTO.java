package com.bm.education.dto;

import com.bm.education.models.Notification;
import lombok.Data;

import java.time.Instant;

/**
 * Data transfer object for a notification.
 */
@Data
public class NotificationDTO {
    /**
     * The ID of the notification.
     */
    private Long id;
    /**
     * The message of the notification.
     */
    private String message;
    /**
     * The link of the notification.
     */
    private String link;
    /**
     * Whether the notification has been read.
     */
    private boolean isRead;
    /**
     * The creation date of the notification.
     */
    private Instant createdAt;

    /**
     * Constructs a new NotificationDTO object.
     *
     * @param notification The notification to create the DTO from.
     */
    public NotificationDTO(Notification notification) {
        this.id = notification.getId();
        this.message = notification.getMessage();
        this.link = notification.getLink();
        this.isRead = notification.getIsRead();
        this.createdAt = notification.getCreatedAt();
    }
}