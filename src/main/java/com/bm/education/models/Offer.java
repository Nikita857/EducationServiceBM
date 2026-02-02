package com.bm.education.models;

import jakarta.persistence.*;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "offers", indexes = {
        @Index(name = "idx_offer_user", columnList = "user_id"),
        @Index(name = "idx_offer_status", columnList = "status")
})
public class Offer {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "offer_seq")
    @SequenceGenerator(name = "offer_seq", sequenceName = "offer_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
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

    @Builder.Default
    @NotNull
    @Enumerated(EnumType.STRING)
    private OfferStatus status = OfferStatus.PENDING;

    @NotNull
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Override
    public final boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null)
            return false;
        Class<?> oEffectiveClass = o instanceof org.hibernate.proxy.HibernateProxy proxy
                ? proxy.getHibernateLazyInitializer().getPersistentClass()
                : o.getClass();
        Class<?> thisEffectiveClass = this instanceof org.hibernate.proxy.HibernateProxy proxy
                ? proxy.getHibernateLazyInitializer().getPersistentClass()
                : this.getClass();
        if (thisEffectiveClass != oEffectiveClass)
            return false;
        Offer offer = (Offer) o;
        return getId() != null && java.util.Objects.equals(getId(), offer.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof org.hibernate.proxy.HibernateProxy proxy
                ? proxy.getHibernateLazyInitializer().getPersistentClass().hashCode()
                : getClass().hashCode();
    }
}
