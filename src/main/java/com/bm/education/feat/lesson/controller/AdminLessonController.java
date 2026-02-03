package com.bm.education.feat.lesson.controller;

import com.bm.education.feat.lesson.dto.LessonResponse;
import com.bm.education.feat.lesson.dto.LessonShortResponse;
import com.bm.education.feat.lesson.dto.LessonUpdateRequest;
import com.bm.education.feat.lesson.service.LessonService;
import com.bm.education.shared.common.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import com.bm.education.shared.validation.ValidationService;
import org.springframework.web.bind.annotation.*;

/**
 * Admin REST API controller for lesson management.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/admin/lessons")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Lessons", description = "Admin lesson management endpoints")
public class AdminLessonController {

    private final LessonService lessonService;
    private final ValidationService validationService;

    /**
     * Gets a paginated list of lessons.
     */
    @GetMapping
    public ApiResponse<ApiResponse.PaginatedPayload<LessonResponse>> getLessonsWithPagination(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") Long moduleId) {
        Page<LessonResponse> lessons = lessonService.getLessonsPaginated(page, size, moduleId);
        return ApiResponse.paginated(lessons);
    }

    /**
     * Deletes a lesson by its ID.
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ApiResponse.success("Урок успешно удален");
    }

    /**
     * Gets a lesson for editing.
     */
    @GetMapping("/{id}")
    public ApiResponse<LessonShortResponse> getLessonForEdit(@PathVariable Long id) {
        LessonShortResponse lesson = lessonService.getLessonShort(id);
        return ApiResponse.success(lesson);
    }

    /**
     * Updates a lesson.
     */
    @PutMapping("/{id}")
    public ApiResponse<Void> updateLesson(@PathVariable Long id,
            @Valid @RequestBody LessonUpdateRequest request,
            BindingResult bindingResult) {
        validationService.validate(bindingResult);
        lessonService.updateLesson(id, request);
        return ApiResponse.success("Урок успешно обновлен");
    }
}