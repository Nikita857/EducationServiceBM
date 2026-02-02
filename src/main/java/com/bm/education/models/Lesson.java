package com.bm.education.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "lessons", indexes = {
        @Index(name = "idx_lesson_title", columnList = "title")
})
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Lesson {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "lesson_seq"
    )
    @SequenceGenerator(
            name = "lesson_seq",
            sequenceName = "lesson_seq",
            allocationSize = 1
    )
    private Long id;

    @JsonBackReference
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    @Size(max = 100)
    @NotNull
    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Size(max = 255)
    @Column(name = "video")
    private String video;

    @Size(max = 5000)
    @Column(name = "description", length = 5000)
    private String description;

    @Column(name = "short_description", nullable = false, length = 50)
    private String shortDescription;

    @Size(max = 5000)
    @Column(name = "test_code", length = 5000)
    private String testCode;

    @Column(name = "content_length")
    private Long contentLength;

    @Builder.Default
    @OneToMany(mappedBy = "lesson")
    private Set<UserProgress> userProgresses = new LinkedHashSet<>();
}