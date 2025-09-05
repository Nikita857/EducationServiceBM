package com.bm.education.services;

import com.bm.education.models.Notification;
import com.bm.education.models.User;
import com.bm.education.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public Notification createNotification(User user, String message, String link) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setLink(link);
        notification.setIsRead(false);
        notification.setCreatedAt(Instant.now());
        return notificationRepository.save(notification);
    }

    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByUserAndIsRead(user, false);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }

    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> notifications = notificationRepository.findByUserAndIsRead(user, false);
        notifications.forEach(notification -> notification.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }
}
