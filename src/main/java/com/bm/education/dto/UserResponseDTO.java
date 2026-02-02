package com.bm.education.dto;

public record UserResponseDTO(
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