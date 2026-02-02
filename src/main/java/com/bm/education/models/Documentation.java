package com.bm.education.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "documentations")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Documentation {
    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "documentation_seq"
    )
    @SequenceGenerator(
            name = "documentation_seq",
            sequenceName = "documentation_seq",
            allocationSize = 1
    )
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false, unique = true)
    private Course course;

    @Builder.Default
    @OneToMany(
            mappedBy = "documentation",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<DocumentationCategory> categories = new LinkedHashSet<>();

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
        Documentation documentation = (Documentation) o;
        return getId() != null && Objects.equals(getId(), documentation.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy proxy
                ? proxy.getHibernateLazyInitializer().getPersistentClass().hashCode()
                : getClass().hashCode();
    }
}
