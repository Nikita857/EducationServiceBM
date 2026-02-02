package com.bm.education.repositories;

import com.bm.education.models.Notification;
import com.bm.education.models.User;
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