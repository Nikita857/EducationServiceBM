package com.bm.education.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.LinkedHashSet;
import java.util.Set;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "documentations")
@Data
@EqualsAndHashCode(of = "id")
@ToString(of = "id")
public class Documentation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", unique = true)
    private Course course;

    @OneToMany(mappedBy = "documentation", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DocumentationCategory> categories = new LinkedHashSet<>();

}
