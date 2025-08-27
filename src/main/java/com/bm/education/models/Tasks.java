package com.bm.education.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import com.bm.education.models.Module;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Data
@Table(name="lessons")
public class Tasks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

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

    @Size(max = 50)
    @NotNull
    @Column(name = "short_description", nullable = false, length = 50)
    private String shortDescription;

    @Size(max = 2000)
    @Column(name = "test_code", length = 2000)
    private String testCode;

    @OneToMany(mappedBy = "lesson")
    private Set<UserProgress> userProgresses = new LinkedHashSet<>();

}
