package com.bm.education.dto;

import com.bm.education.models.Notification;
import lombok.Data;

import java.time.Instant;

@Data
public class NotificationDTO {
    private Long id;
    private String message;
    private String link;
    private boolean isRead;
    private Instant createdAt;

    public NotificationDTO(Notification notification) {
        this.id = notification.getId();
        this.message = notification.getMessage();
        this.link = notification.getLink();
        this.isRead = notification.getIsRead();
        this.createdAt = notification.getCreatedAt();
    }
}
