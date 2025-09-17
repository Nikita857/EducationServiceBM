package com.bm.education.dto;

import lombok.Data;

import java.time.Instant;

/**
 * Data transfer object for a user response.
 */
@Data
public class UserResponseDTO {

    /**
     * The ID of the user.
     */
    private Integer id;

    /**
     * The first name of the user.
     */
    private String firstName;

    /**
     * The last name of the user.
     */
    private String lastName;

    /**
     * The department of the user.
     */
    private String department;

    /**
     * The job title of the user.
     */
    private String jobTitle;

    /**
     * The qualification of the user.
     */
    private String qualification;

    /**
     * The username of the user.
     */
    private String username;

    /**
     * The avatar of the user.
     */
    private String avatar;

    /**
     * The creation date of the user.
     */
    private Instant createdAt;

    /**
     * The role of the user.
     */
    private String role;

    /**
     * Constructs a new UserResponseDTO object.
     *
     * @param id The ID of the user.
     * @param firstName The first name of the user.
     * @param lastName The last name of the user.
     * @param department The department of the user.
     * @param jobTitle The job title of the user.
     * @param qualification The qualification of the user.
     * @param username The username of the user.
     * @param avatar The avatar of the user.
     * @param createdAt The creation date of the user.
     * @param role The role of the user.
     */
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