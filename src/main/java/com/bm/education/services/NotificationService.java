package com.bm.education.services;

import com.bm.education.models.Notification;
import com.bm.education.models.User;
import com.bm.education.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing notifications.
 */
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    /**
     * Creates a new notification.
     *
     * @param user The user to create the notification for.
     * @param message The message of the notification.
     * @param link The link for the notification.
     * @return The created notification.
     */
    @Transactional
    public Notification createNotification(User user, String message, String link) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setLink(link);
        notification.setIsRead(false);
        notification.setCreatedAt(Instant.now());
        return notificationRepository.save(notification);
    }

    /**
     * Gets all unread notifications for a user.
     *
     * @param user The user to get the notifications for.
     * @return A list of all unread notifications for the user.
     */
    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByUserAndIsRead(user, false);
    }

    /**
     * Marks a notification as read.
     *
     * @param notificationId The ID of the notification to mark as read.
     */
    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }

    /**
     * Marks all unread notifications for a user as read.
     *
     * @param user The user to mark the notifications as read for.
     */
    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> notifications = notificationRepository.findByUserAndIsRead(user, false);
        notifications.forEach(notification -> notification.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }
}