package com.bm.education.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.Instant;

@Table(name = "notifications")
@Entity
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "created_at")
    private Instant createdAt;

    @NotNull
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @Size(max = 255)
    @Column(name = "link")
    private String link;

    @Size(max = 255)
    @NotNull
    @Column(name = "message", nullable = false)
    private String message;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
