package com.bm.education.models;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "offers")
@Getter
@Setter
public class Offer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Size(max = 50)
    @NotBlank(message = "Тема не может быть пустой")
    @Column(name = "topic", nullable = false, length = 50)
    private String topic;

    @Size(max = 2000)
    @NotBlank(message = "Описание не может быть пустым")
    @Lob
    @Column(name = "description", nullable = false, length = 2000)
    private String description;

    @Column(name = "response", length = 2000)
    @Lob
    private String response;

    @NotNull
    @Enumerated(EnumType.STRING)
    private OfferStatus status;

    @NotNull
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Offer() {
        this.status = OfferStatus.PENDING; // Значение по умолчанию
        this.createdAt = LocalDateTime.now(); // Текущее время
    }

    // PrePersist - автоматически вызывается перед сохранением
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = OfferStatus.PENDING;
        }
    }


}
