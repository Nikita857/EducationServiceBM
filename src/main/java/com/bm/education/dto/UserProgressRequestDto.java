package com.bm.education.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProgressRequestDto {
    @NotNull
    private Integer userId;
    @NotNull
    private Integer lessonId;
    @NotNull
    private Integer moduleId;
    @NotNull
    private Integer courseId;
}