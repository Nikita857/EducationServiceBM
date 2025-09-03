package com.bm.education.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class UserResponseDTO {

    private Integer id;

    private String firstName;

    private String lastName;

    private String department;

    private String jobTitle;

    private String qualification;

    private String username;

    private String avatar;

    private Instant createdAt;

    private String role;

    public UserResponseDTO(Integer id, String firstName, String lastName, String department, String jobTitle, String qualification, String username, String avatar, Instant createdAt, String role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.department = department;
        this.jobTitle = jobTitle;
        this.qualification = qualification;
        this.username = username;
        this.avatar = avatar;
        this.createdAt = createdAt;
        this.role = role;
    }
}
