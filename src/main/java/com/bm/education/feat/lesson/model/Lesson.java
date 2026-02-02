package com.bm.education.feat.lesson.model;

import com.bm.education.feat.module.model.Module;
import com.bm.education.feat.user.model.UserProgress;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.databind.JsonNode;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "lesson_seq")
    @SequenceGenerator(name = "lesson_seq", sequenceName = "lesson_seq", allocationSize = 1)
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

    @Column(name = "short_description", nullable = false, length = 50)
    private String shortDescription;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "content", columnDefinition = "jsonb")
    private JsonNode content;

    @Column(name = "lesson_order")
    private Integer lessonOrder;

    @OneToOne(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    private com.bm.education.feat.quiz.model.Quiz quiz;

    @Column(name = "content_length")
    private Long contentLength;

    @Builder.Default
    @OneToMany(mappedBy = "lesson")
    private Set<UserProgress> userProgresses = new LinkedHashSet<>();
}