package com.bm.education.dto;

import com.bm.education.models.Notification;
import java.time.Instant;

public record NotificationDTO(
        Long id,
        String message,
        String link,
        boolean isRead,
        Instant createdAt) {
    public static NotificationDTO fromEntity(Notification notification) {
        return new NotificationDTO(
                notification.getId(),
                notification.getMessage(),
                notification.getLink(),
                notification.getIsRead(),
                notification.getCreatedAt());
    }
}