package com.bm.education.repositories;

import com.bm.education.models.Role;
import com.bm.education.models.User;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByRefreshToken(String refreshToken);

    boolean existsByUsername(String username);

    @NotNull
    List<User> findAll();

    long count();

    @Modifying
    @Query(value = "DELETE FROM users_roles WHERE user_id = :userId", nativeQuery = true)
    void deleteUserRolesByUserId(@Param("userId") Long userId);

    Page<User> findAllByRoles(Pageable pageable, Role role);
}