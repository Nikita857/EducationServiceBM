package com.bm.education.feat.notification.repository;

import com.bm.education.feat.notification.model.Notification;
import com.bm.education.feat.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserAndIsRead(User user, boolean isRead);

    @Modifying
    void deleteByUser_Id(Long userId);
}