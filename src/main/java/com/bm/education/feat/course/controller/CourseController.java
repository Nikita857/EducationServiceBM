package com.bm.education.feat.course.controller;

import com.bm.education.feat.course.dto.CourseDetailsResponse;
import com.bm.education.feat.course.dto.CourseWithProgress;
import com.bm.education.feat.course.service.CoursesService;
import com.bm.education.feat.module.dto.ViewModule;
import com.bm.education.feat.lesson.service.LessonService;
import com.bm.education.feat.user.model.User;
import com.bm.education.feat.user.service.UserService;
import com.bm.education.shared.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public REST API controller for courses.
 * Provides endpoints for course discovery, progress tracking, and lesson
 * access.
 */
@RestController
@RequestMapping("${api.base-path:/api/v1}/courses")
@RequiredArgsConstructor
@Tag(name = "Courses", description = "Public course endpoints")
public class CourseController {

    private final CoursesService coursesService;
    private final LessonService lessonService;
    private final UserService userService;

    /**
     * Get all courses with user progress.
     */
    @GetMapping
    @Operation(summary = "Get all courses with progress", description = "Returns list of all available courses with user's progress")
    public ApiResponse<List<CourseWithProgress>> getAllCourses(Authentication auth) {
        User user = userService.getUserByUsername(auth.getName());
        return ApiResponse.success(coursesService.getCoursesWithProgress(user.getId()));
    }

    /**
     * Get course by slug with full details.
     */
    @GetMapping("/{slug}")
    @Operation(summary = "Get course details", description = "Returns course details with modules and progress")
    public ApiResponse<CourseDetailsResponse> getCourseBySlug(@PathVariable String slug, Authentication auth) {
        User user = userService.getUserByUsername(auth.getName());
        return ApiResponse.success(coursesService.getCourseDetails(slug, user.getId()));
    }

    /**
     * Get module lessons with progress.
     */
    @GetMapping("/{courseSlug}/modules/{moduleSlug}/lessons")
    @Operation(summary = "Get module lessons", description = "Returns all lessons in a module with user's progress")
    public ApiResponse<List<ViewModule>> getModuleLessons(
            @PathVariable String courseSlug,
            @PathVariable String moduleSlug,
            Authentication auth) {
        return ApiResponse.success(lessonService.getLessonsWithProgress(auth.getName(), moduleSlug));
    }
}
