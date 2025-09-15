package com.bm.education.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.Instant;
import java.util.stream.Collectors;
import java.util.*;
@Entity
@Data
@Table(name="users")
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(min = 2, max = 50, message = "Имя должно быть от 2 до 50 символов")
    @NotNull
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Size(min = 2, max = 50, message = "Фамилия должна быть от 2 до 50 символов")
    @NotNull
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Size(min = 2, max = 50, message = "Поле отдел должно быть от 2 до 50 символов")
    @NotNull
    @Column(name = "department", nullable = false, length = 50)
    private String department;

    @Size(min=2, max = 50, message = "Поле должность должно быть от 2 до 50 символов")
    @NotNull
    @Column(name = "job_title", nullable = false, length = 50)
    private String jobTitle;

    @Column(name = "qualification", length = 50)
    private String qualification;

    @Size(min = 5, max = 50, message = "Поле логин должно быть от 5 до 50 символов")
    @NotNull
    @Column(name = "username", nullable = false, length = 50)
    private String username;

    @Size(min = 8, max = 255, message = "Длин пароля должна быть от 8 до 20 символов")
    @NotNull
    @Column(name = "password", nullable = false)
    private String password;

    @Size(max = 200)
    @Column(name = "avatar", nullable = false)
    private String avatar;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @ColumnDefault("current_timestamp()")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "user")
    private Set<Offer> offers = new LinkedHashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<UserProgress> userProgresses = new LinkedHashSet<>();

    @OneToMany(mappedBy = "user", orphanRemoval = true)
    private Set<Notification> notifications = new HashSet<>();

    @ElementCollection(targetClass = Role.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    private Set<Role> roles = new HashSet<>();

    @PrePersist
    protected void oncCreate() {
        this.setQualification("1");
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))
                .collect(Collectors.toList());
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

