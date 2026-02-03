package com.bm.education.feat.module.controller;

import com.bm.education.feat.lesson.service.LessonService;
import com.bm.education.feat.module.dto.ModuleDetailsResponse;
import com.bm.education.feat.module.dto.ViewModule;
import com.bm.education.feat.module.model.Module;
import com.bm.education.feat.module.service.ModuleService;
import com.bm.education.feat.user.model.User;
import com.bm.education.feat.user.service.UserService;
import com.bm.education.shared.common.ApiResponse;
import com.bm.education.shared.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public REST API controller for modules.
 * Provides endpoints for module details and lesson access.
 */
@RestController
@RequestMapping("/api/v1/modules")
@RequiredArgsConstructor
@Tag(name = "Modules", description = "Public module endpoints")
public class ModuleController {

    private final ModuleService moduleService;
    private final LessonService lessonService;
    private final UserService userService;

    /**
     * Get module details by slug.
     */
    @GetMapping("/{slug}")
    @Operation(summary = "Get module details", description = "Returns module details with progress info")
    public ApiResponse<ModuleDetailsResponse> getModuleBySlug(
            @PathVariable String slug,
            Authentication auth) {
        User user = userService.getUserByUsername(auth.getName());
        Module module = moduleService.getModuleBySlug(slug);

        if (module == null) {
            throw new ResourceNotFoundException("Модуль " + slug);
        }

        boolean lessonsCompleted = moduleService.isModuleCompleted(module, user.getId());

        ModuleDetailsResponse response = new ModuleDetailsResponse(
                module.getId(),
                module.getTitle(),
                module.getSlug(),
                module.getDescription(),
                module.getCourse().getTitle(),
                module.getCourse().getSlug(),
                lessonsCompleted);

        return ApiResponse.success(response);
    }

    /**
     * Get all lessons in a module with user progress.
     */
    @GetMapping("/{slug}/lessons")
    @Operation(summary = "Get module lessons", description = "Returns all lessons in a module with user's progress")
    public ApiResponse<List<ViewModule>> getModuleLessons(
            @PathVariable String slug,
            Authentication auth) {
        List<ViewModule> lessons = lessonService.getLessonsWithProgress(auth.getName(), slug);
        return ApiResponse.success(lessons);
    }
}
