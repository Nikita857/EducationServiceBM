package com.bm.education.feat.user.service;

import com.bm.education.feat.user.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * Custom implementation of Spring Security's UserDetails.
 */
public class CustomUserDetails implements UserDetails {
    private final User user;

    /**
     * Constructs a new CustomUserDetails object.
     *
     * @param user The user to create the details for.
     */
    public CustomUserDetails(User user) {
        this.user = user;
    }

    /**
     * Gets the authorities of the user.
     *
     * @return The authorities of the user.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(
                new SimpleGrantedAuthority(user.getRoles().toString())
        );
    }

    /**
     * Gets the password of the user.
     *
     * @return The password of the user.
     */
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    /**
     * Gets the username of the user.
     *
     * @return The username of the user.
     */
    @Override
    public String getUsername() {
        return user.getUsername();
    }

    /**
     * Checks if the user's account is expired.
     *
     * @return true if the user's account is not expired, false otherwise.
     */
    @Override public boolean isAccountNonExpired() { return true; }

    /**
     * Checks if the user's account is locked.
     *
     * @return true if the user's account is not locked, false otherwise.
     */
    @Override public boolean isAccountNonLocked() { return true; }

    /**
     * Checks if the user's credentials are expired.
     *
     * @return true if the user's credentials are not expired, false otherwise.
     */
    @Override public boolean isCredentialsNonExpired() { return true; }

    /**
     * Checks if the user is enabled.
     *
     * @return true if the user is enabled, false otherwise.
     */
    @Override public boolean isEnabled() { return true; }
}