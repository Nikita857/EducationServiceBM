package com.bm.education.repositories;

import com.bm.education.models.Role;
import com.bm.education.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    List<User> findAll();
    long count();

    @Modifying
    @Query(value = "DELETE FROM user_role WHERE user_id = :userId", nativeQuery = true)
    void deleteUserRolesByUserId(@Param("userId") Integer userId);
    Page<User> findAllByRoles(Pageable pageable, Role role);
}