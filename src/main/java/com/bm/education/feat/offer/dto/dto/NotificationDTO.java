package com.bm.education.feat.offer.dto.dto;

import com.bm.education.feat.notification.model.Notification;
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