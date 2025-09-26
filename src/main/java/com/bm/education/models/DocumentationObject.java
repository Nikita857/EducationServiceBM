package com.bm.education.models;

import jakarta.persistence.*;
import lombok.Data;

import java.lang.reflect.Type;
import java.util.HashSet;
import java.util.Set;

import lombok.EqualsAndHashCode;
import lombok.ToString;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "documentation_objects")
@Data
@EqualsAndHashCode(of = "id")
@ToString(of = "id")
public class DocumentationObject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.EAGER)
    @JoinTable(
        name = "documentation_object_tags",
        joinColumns = @JoinColumn(name = "documentation_object_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    @Column(name = "file")
    private String file;

    @Lob
    @Column(name = "text")
    private String text;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private DocumentationCategory category;

}

