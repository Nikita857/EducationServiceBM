package com.bm.education.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
@Data
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Size(max = 255)
    @Column(name = "image")
    private String image;

    @Lob
    @Column(name = "description")
    private String description;

    @Pattern(regexp = "^[a-z0-9-]+$", message = "URL может содержать только латинские буквы, цифры и дефисы")
    @Size(max = 100, message = "URL не должен превышать 100 символов")
    @Column(unique = true, nullable = false)
    private String slug;

    @OneToMany(mappedBy = "course")
    private Set<Module> modules = new LinkedHashSet<>();

    @OneToMany(mappedBy = "course")
    private Set<UserProgress> userProgresses = new LinkedHashSet<>();

    @NotNull
    @Enumerated(EnumType.STRING)
    private CourseStatus status;

    @NotNull
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

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}
