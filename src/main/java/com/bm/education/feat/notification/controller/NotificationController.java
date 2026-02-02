package com.bm.education.feat.notification.controller;

import com.bm.education.feat.offer.dto.dto.NotificationDTO;
import com.bm.education.feat.user.model.User;
import com.bm.education.feat.notification.service.NotificationService;
import com.bm.education.feat.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.userdetails.UserDetails;

/**
 * Controller for handling notification-related requests.
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    /**
     * Gets all unread notifications for the authenticated user.
     *
     * @param userDetails The details of the authenticated user.
     * @return A response entity containing a list of all unread notifications for
     *         the authenticated user.
     */
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.getUserByUsername(userDetails.getUsername());
        List<NotificationDTO> notifications = notificationService.getUnreadNotifications(currentUser)
                .stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(notifications);
    }

    /**
     * Marks a notification as read.
     *
     * @param id The ID of the notification to mark as read.
     * @return A response entity indicating that the notification was marked as read
     *         successfully.
     */
    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Marks all unread notifications for the authenticated user as read.
     *
     * @param userDetails The details of the authenticated user.
     * @return A response entity indicating that all unread notifications for the
     *         authenticated user were marked as read successfully.
     */
    @PostMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.getUserByUsername(userDetails.getUsername());
        notificationService.markAllAsRead(currentUser);
        return ResponseEntity.ok().build();
    }
}