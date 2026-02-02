package com.bm.education.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "courses", indexes = {
        @Index(name = "idx_course_slug", columnList = "slug"),
        @Index(name = "idx_course_title", columnList = "title")
})
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "course_seq")
    @SequenceGenerator(name = "course_seq", sequenceName = "course_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "image", length = 255)
    private String image;

    @Lob
    @Column(name = "description")
    private String description;

    @Pattern(regexp = "^[a-z0-9-]+$", message = "URL может содержать только латинские буквы, цифры и дефисы")
    @Size(max = 100, message = "URL не должен превышать 100 символов")
    @Column(unique = true, nullable = false)
    private String slug;

    @Builder.Default
    @OneToMany(mappedBy = "course")
    private Set<Module> modules = new LinkedHashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "course")
    private Set<UserProgress> userProgresses = new LinkedHashSet<>();

    @OneToOne(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private Documentation documentation;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CourseStatus status;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        status = CourseStatus.INACTIVE;
    }

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
        Course course = (Course) o;
        return getId() != null && java.util.Objects.equals(getId(), course.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof org.hibernate.proxy.HibernateProxy proxy
                ? proxy.getHibernateLazyInitializer().getPersistentClass().hashCode()
                : getClass().hashCode();
    }
}
