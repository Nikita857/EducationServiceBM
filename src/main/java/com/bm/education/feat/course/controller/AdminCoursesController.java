package com.bm.education.feat.course.controller;

import com.bm.education.feat.course.dto.CourseCreateRequest;
import com.bm.education.feat.course.dto.CourseResponse;
import com.bm.education.feat.course.dto.CourseUpdateRequest;
import com.bm.education.feat.course.dto.CourseUpdateStatusRequest;
import com.bm.education.feat.module.dto.ModuleResponse;
import com.bm.education.shared.common.ApiResponse;
import com.bm.education.feat.course.service.CoursesService;
import com.bm.education.shared.validation.ValidationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Controller for handling admin-related course requests.
 */
@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/admin/courses")
public class AdminCoursesController {

    private final CoursesService coursesService;
    private final ValidationService validationService;

    /**
     * Gets a paginated list of courses.
     */
    @GetMapping
    public ApiResponse<ApiResponse.PaginatedPayload<CourseResponse>> getCoursesPaginated(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") Long courseId) {
        Page<CourseResponse> courses = coursesService.getCoursesForDTO(page, size, courseId);
        return ApiResponse.paginated(courses);
    }

    /**
     * Gets all modules for a course.
     */
    @GetMapping("/{id}/modules")
    public ApiResponse<List<ModuleResponse>> getCourseModules(@PathVariable Long id) {
        List<ModuleResponse> modules = coursesService.getModulesOfCourse(id);
        return ApiResponse.success(modules);
    }

    /**
     * Gets all courses.
     */
    @GetMapping("/all")
    public ApiResponse<List<CourseResponse>> getAllCourses() {
        List<CourseResponse> courses = coursesService.findCoursesAndWriteDTO();
        return ApiResponse.success(courses);
    }

    /**
     * Deletes a course by its ID.
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCourse(@PathVariable Long id) {
        coursesService.deleteCourseById(id);
        return ApiResponse.success("Курс успешно удален");
    }

    /**
     * Creates a new course.
     */
    @PostMapping("/create")
    public ApiResponse<CourseResponse> createCourse(
            @Valid @ModelAttribute CourseCreateRequest courseRequest,
            BindingResult bindingResult,
            @RequestParam("image") MultipartFile imageFile) {
        validationService.validate(bindingResult);
        CourseResponse savedCourse = coursesService.createCourse(courseRequest, imageFile);
        return ApiResponse.success("Курс успешно создан", savedCourse);
    }

    /**
     * Updates a course.
     */
    @PostMapping("/update")
    public ApiResponse<Void> updateCourse(
            @Valid @ModelAttribute CourseUpdateRequest courseUpdateRequest,
            BindingResult bindingResult,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        validationService.validate(bindingResult);
        coursesService.updateCourse(courseUpdateRequest);
        return ApiResponse.success("Курс успешно обновлен");
    }

    /**
     * Updates the status of a course.
     */
    @PostMapping("/update/status")
    public ApiResponse<Void> updateCourseStatus(
            @Valid @RequestBody CourseUpdateStatusRequest dto,
            BindingResult bindingResult) {
        validationService.validate(bindingResult);
        coursesService.updateCourseStatus(dto.status(), dto.courseId());
        return ApiResponse.success("Статус успешно обновлен");
    }
}