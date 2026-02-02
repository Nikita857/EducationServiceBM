package com.bm.education.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.time.Instant;
import java.util.Objects;

@Entity
@Table(
        name = "user_module_completions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "module_id"})
})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserModuleCompletion {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "user_module_completion_seq"
    )
    @SequenceGenerator(
            name = "user_module_completion_seq",
            sequenceName = "user_module_completion_seq",
            allocationSize = 1
    )
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    @Column(name = "completion_date", nullable = false)
    private Instant completionDate;

    @Column(name = "grade", nullable = false)
    private Double grade;

    public UserModuleCompletion(User user, Module module, Double grade) {
        this.user = user;
        this.module = module;
        this.grade = grade;
        this.completionDate = Instant.now();
    }

    @Override
    public final boolean equals(Object object) {
        if (this == object) return true;
        if (object == null) return false;
        Class<?> oEffectiveClass = object instanceof HibernateProxy proxy
                ? proxy.getHibernateLazyInitializer().getPersistentClass() : object.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy proxy
                ? proxy.getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        UserModuleCompletion that = (UserModuleCompletion) object;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy proxy
                ? proxy.getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
