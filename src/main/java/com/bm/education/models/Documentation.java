package com.bm.education.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "documentations")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Documentation {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "documentation_seq")
    @SequenceGenerator(name = "documentation_seq", sequenceName = "documentation_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", unique = true)
    private Course course;

    @Builder.Default
    @OneToMany(mappedBy = "documentation", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DocumentationCategory> categories = new LinkedHashSet<>();

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
        Documentation documentation = (Documentation) o;
        return getId() != null && java.util.Objects.equals(getId(), documentation.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof org.hibernate.proxy.HibernateProxy proxy
                ? proxy.getHibernateLazyInitializer().getPersistentClass().hashCode()
                : getClass().hashCode();
    }
}
