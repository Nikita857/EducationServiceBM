package com.bm.education.feat.user.dto;

public record UserResponse(
        Long id,
        String firstName,
        String lastName,
        String department,
        String jobTitle,
        String qualification,
        String username,
        String avatar,
        String createdAt,
        String role) {
}