package com.bm.education.feat.lesson.controller;

import com.bm.education.feat.lesson.dto.LessonShortResponse;
import com.bm.education.feat.lesson.service.LessonService;
import com.bm.education.feat.user.model.User;
import com.bm.education.feat.user.service.UserProgressService;
import com.bm.education.feat.user.service.UserService;
import com.bm.education.shared.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Public REST API controller for lessons.
 * Provides endpoints for lesson content and progress tracking.
 */
@RestController
@RequestMapping("/api/v1/lessons")
@RequiredArgsConstructor
@Tag(name = "Lessons", description = "Public lesson endpoints")
public class LessonController {

    private final LessonService lessonService;
    private final UserProgressService userProgressService;
    private final UserService userService;

    /**
     * Get lesson content by ID.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get lesson content", description = "Returns lesson content for viewing")
    public ApiResponse<LessonShortResponse> getLesson(@PathVariable Long id) {
        LessonShortResponse lesson = lessonService.getLessonShort(id);
        return ApiResponse.success(lesson);
    }

    /**
     * Mark lesson as completed.
     */
    @PostMapping("/{id}/complete")
    @Operation(summary = "Complete lesson", description = "Marks a lesson as completed for the current user")
    public ApiResponse<Void> completeLesson(
            @PathVariable Long id,
            Authentication auth) {
        User user = userService.getUserByUsername(auth.getName());
        userProgressService.saveProgressByLessonId(user.getId(), id);
        return ApiResponse.success("Урок отмечен как пройденный");
    }
}
