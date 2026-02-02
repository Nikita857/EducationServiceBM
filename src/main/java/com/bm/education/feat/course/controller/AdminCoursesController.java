package com.bm.education.feat.course.controller;

import com.bm.education.feat.course.dto.CourseCreateRequest;
import com.bm.education.feat.course.dto.CourseResponseDTO;
import com.bm.education.feat.course.dto.CourseUpdateRequest;
import com.bm.education.feat.course.dto.CourseUpdateStatusRequest;
import com.bm.education.feat.module.dto.ModuleResponseDTO;
import com.bm.education.shared.common.ApiResponse;
import com.bm.education.feat.course.model.Course;
import com.bm.education.feat.course.model.CourseStatus;
import com.bm.education.feat.course.service.CoursesService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Controller for handling admin-related course requests.
 */
@RestController

@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCoursesController {

    private final CoursesService coursesService;

    /**
     * Gets a paginated list of courses.
     *
     * @param page     The page number.
     * @param size     The page size.
     * @param courseId The ID of the course to filter by, or 0 to retrieve all
     *                 courses.
     * @return A response entity containing the paginated list of courses.
     */
    @GetMapping("/admin/courses")
    public ResponseEntity<ApiResponse<?>> sendUsersJson(@RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") Long courseId) {
        try {
            Page<CourseResponseDTO> courseResponseDTOS = coursesService.getCoursesForDTO(page, size, courseId);
            return ResponseEntity.ok(ApiResponse.paginated(courseResponseDTOS));
        } catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error(String.format("Internal Server Error: %s", e.getMessage())));
        }
    }

    /**
     * Gets all modules for a course.
     *
     * @param id The ID of the course.
     * @return A response entity containing a list of all modules for the course.
     */
    @GetMapping("/admin/courses/{id}/modules")
    public ResponseEntity<?> getCourseModules(@PathVariable Long id) {
        try {
            List<ModuleResponseDTO> modules = coursesService.getModulesOfCourse(id);
            if (modules != null && !modules.isEmpty()) {
                return ResponseEntity.ok(
                        ApiResponse.success(modules));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        ApiResponse.error("Modules not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(
                            String.format("Internal server error: %s", e.getMessage())));
        }
    }

    /**
     * Gets all courses.
     *
     * @return A response entity containing a list of all courses.
     */
    @GetMapping("/admin/courses/all")
    public ResponseEntity<?> getCourses() {
        try {
            List<CourseResponseDTO> courses = coursesService.findCoursesAndWriteDTO();
            if (courses != null && !courses.isEmpty()) {
                return ResponseEntity.ok(
                        ApiResponse.success(courses));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        ApiResponse.error("Courses not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(String.format("Error: %s", e.getMessage())));
        }
    }

    /**
     * Deletes a course by its ID.
     *
     * @param id The ID of the course to delete.
     * @return A response entity indicating that the course was deleted
     *         successfully, or an error if the course was not found.
     */
    @DeleteMapping("/admin/courses/{id}/delete")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        try {
            boolean success = coursesService.deleteCourseById(id);
            if (success) {
                return ResponseEntity.ok(ApiResponse.success("Курс успешно удален"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Курс с id " + id + " не найден"));
            }
        } catch (Exception e) {

            return ResponseEntity.internalServerError().body(ApiResponse.error("An internal server error occurred."));
        }
    }

    /**
     * Creates a new course.
     *
     * @param courseRequest The request object containing the course details.
     * @param bindingResult The result of the validation.
     * @param imageFile     The image file for the course.
     * @return A response entity containing the created course.
     */
    @PostMapping("/admin/course/create")
    public ResponseEntity<ApiResponse<?>> createCourse(@Valid @ModelAttribute CourseCreateRequest courseRequest,
            BindingResult bindingResult,
            @RequestParam("image") MultipartFile imageFile) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            fieldError -> Objects.requireNonNullElse(
                                    fieldError.getDefaultMessage(),
                                    "сообщение об ошибке не указано")));
            return ResponseEntity.badRequest().body(ApiResponse.validationError(errors));
        }

        try {
            Course savedCourse = coursesService.createCourse(courseRequest, imageFile);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Курс успешно создан", savedCourse));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (IOException e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Ошибка при загрузке файла."));
        }
    }

    /**
     * Updates a course.
     *
     * @param courseUpdateRequest The request object containing the updated course
     *                            details.
     * @return A response entity indicating that the course was updated
     *         successfully.
     */
    @PostMapping("/admin/courses/update")
    public ResponseEntity<ApiResponse<?>> updateCourse(@Valid @ModelAttribute CourseUpdateRequest courseUpdateRequest,
            BindingResult bindingResult,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            fieldError -> Objects.requireNonNullElse(
                                    fieldError.getDefaultMessage(),
                                    "сообщение об ошибке не указано")));
            return ResponseEntity.badRequest().body(ApiResponse.validationError(errors));
        }

        try {
            Course updatedCourse = coursesService.updateCourse(courseUpdateRequest);
            return ResponseEntity
                    .ok(ApiResponse.success("Курс успешно обновлен", Map.of("courseId", updatedCourse.getId())));
        } catch (IOException e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Ошибка при загрузке файла."));
        } catch (IllegalArgumentException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Внутренняя ошибка сервера: " + e.getMessage()));
        }
    }

    /**
     * Updates the status of a course.
     *
     * @param dto           The DTO containing the updated course status.
     * @param bindingResult The result of the validation.
     * @return A response entity indicating that the course status was updated
     *         successfully.
     */
    @PostMapping("/admin/courses/update/status")
    public ResponseEntity<ApiResponse<?>> updateCourseStatus(
            @Valid @RequestBody CourseUpdateStatusRequest dto,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            error -> Objects.requireNonNullElse(
                                    error.getDefaultMessage(),
                                    "Validation error")));
            return ResponseEntity.badRequest()
                    .body(ApiResponse.validationError(errors));
        }

        try {
            // Проверка валидности статуса
            CourseStatus.valueOf(dto.status());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Такого статуса не существует"));
        }

        try {
            boolean isUpdated = coursesService.updateCourseStatus(dto.status(), dto.courseId());

            if (isUpdated) {
                return ResponseEntity.ok()
                        .body(ApiResponse.success("Статус успешно обновлен",
                                Map.of("status", dto.status())));
            } else {

                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(ApiResponse.error("Статус не был изменен"));
            }

        } catch (EntityNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Курс не найден"));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Внутренняя ошибка сервера"));
        }
    }
}