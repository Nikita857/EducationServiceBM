package com.bm.education.feat.user.controller;

import com.bm.education.feat.user.dto.UserProgressRequestDto;
import com.bm.education.feat.user.service.UserProgressService;
import com.bm.education.shared.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for handling user progress requests.
 */
@RestController
@RequestMapping("/api/v1/progress")
@RequiredArgsConstructor
@Tag(name = "Progress", description = "User learning progress management")
public class UserProgressController {

    private final UserProgressService userProgressService;

    /**
     * Saves the progress of a user for a lesson.
     *
     * @param request The request object containing the user progress details.
     * @return ApiResponse indicating success.
     */
    @PostMapping
    @Operation(summary = "Save progress", description = "Marks a lesson as completed for the user")
    public ApiResponse<Void> saveUserProgress(@RequestBody UserProgressRequestDto request) {
        userProgressService.saveProgress(
                request.userId(),
                request.courseId(),
                request.moduleId(),
                request.lessonId());
        return ApiResponse.success("Прогресс сохранён");
    }
}