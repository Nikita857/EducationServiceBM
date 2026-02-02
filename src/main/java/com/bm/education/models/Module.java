package com.bm.education.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.ToString;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.proxy.HibernateProxy;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "modules", indexes = {
        @Index(name = "idx_module_slug", columnList = "slug"),
        @Index(name = "idx_module_title", columnList = "title")
})
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Module {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "module_seq"
    )
    @SequenceGenerator(
            name = "module_seq",
            sequenceName = "module_seq",
            allocationSize = 1
    )
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "slug", nullable = false, length = 50)
    private String slug;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @NotNull
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ModuleStatus status;

    @Builder.Default
    @JsonManagedReference
    @OneToMany(mappedBy = "module")
    private Set<Lesson> lessons = new LinkedHashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "module")
    private Set<UserProgress> userProgresses = new LinkedHashSet<>();

    @PrePersist
    protected void onCreate() {
        this.status = ModuleStatus.INACTIVE;
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null)
            return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy proxy
                ? proxy.getHibernateLazyInitializer().getPersistentClass()
                : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy proxy
                ? proxy.getHibernateLazyInitializer().getPersistentClass()
                : this.getClass();
        if (thisEffectiveClass != oEffectiveClass)
            return false;
        Module module = (Module) o;
        return getId() != null && java.util.Objects.equals(getId(), module.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy proxy
                ? proxy.getHibernateLazyInitializer().getPersistentClass().hashCode()
                : getClass().hashCode();
    }
}