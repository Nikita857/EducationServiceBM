package com.bm.education.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data transfer object for a user progress request.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProgressRequestDto {
    /**
     * The ID of the user.
     */
    @NotNull
    private Integer userId;
    /**
     * The ID of the lesson.
     */
    @NotNull
    private Integer lessonId;
    /**
     * The ID of the module.
     */
    @NotNull
    private Integer moduleId;
    /**
     * The ID of the course.
     */
    @NotNull
    private Integer courseId;
}