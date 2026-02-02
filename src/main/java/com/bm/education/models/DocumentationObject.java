package com.bm.education.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "documentation_objects", indexes = {
        @Index(name = "idx_doc_obj_name", columnList = "name")
})
public class DocumentationObject {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "doc_obj_seq")
    @SequenceGenerator(name = "doc_obj_seq", sequenceName = "doc_obj_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Builder.Default
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.EAGER)
    @JoinTable(name = "documentation_object_tags", joinColumns = @JoinColumn(name = "documentation_object_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<Tag> tags = new HashSet<>();

    @Column(name = "file")
    private String file;

    @Lob
    @Column(name = "text")
    private String text;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private DocumentationCategory category;

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
        DocumentationObject that = (DocumentationObject) o;
        return getId() != null && java.util.Objects.equals(getId(), that.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof org.hibernate.proxy.HibernateProxy proxy
                ? proxy.getHibernateLazyInitializer().getPersistentClass().hashCode()
                : getClass().hashCode();
    }
}
