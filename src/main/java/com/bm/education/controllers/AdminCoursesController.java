package com.bm.education.controllers;

import com.bm.education.api.ApiResponse;
import com.bm.education.dto.*;
import com.bm.education.models.Course;
import com.bm.education.models.CourseStatus;
import com.bm.education.services.CoursesService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

@RestController
@Slf4j
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCoursesController {

    private final CoursesService coursesService;

    @GetMapping("/admin/courses")
    public ResponseEntity<ApiResponse<?>> sendUsersJson(@RequestParam(defaultValue = "1") int page,
                                                        @RequestParam(defaultValue = "10") int size,
                                                        @RequestParam(defaultValue = "0") int courseId) {
        try {
            Page<CourseResponseDTO> courseResponseDTOS = coursesService.getCoursesForDTO(page, size, courseId);
            return ResponseEntity.ok(ApiResponse.paginated(courseResponseDTOS));
        } catch (Exception e) {
            log.error("Error getting courses: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error(String.format("Internal Server Error: %s", e.getMessage())));
        }
    }

    @GetMapping("/admin/courses/{id}/modules")
    public ResponseEntity<?> getCourseModules(@PathVariable int id) {
        try {
            List<ModuleResponseDTO> modules = coursesService.getModulesOfCourse(id);
            if(modules != null && !modules.isEmpty()) {
                return ResponseEntity.ok(
                        ApiResponse.success(
                                "modules", modules));
            }else{
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        ApiResponse.error("Modules not found")
                );
            }
        }catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(
                            String.format("Internal server error: %s", e.getMessage()))
            );
        }
    }
    @GetMapping("/admin/courses/all")
    public ResponseEntity<?> getCourses() {
        try {
            List<CourseResponseDTO> courses = coursesService.findCoursesAndWriteDTO();
            if(courses != null && !courses.isEmpty()) {
                return ResponseEntity.ok(
                        ApiResponse.success("courses", courses));
            }else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        ApiResponse.error("Courses not found")
                );
            }
        }catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(String.format("Error: %s", e.getMessage()))
            );
        }
    }

    @DeleteMapping("/admin/courses/{id}/delete")
    public ResponseEntity<?> deleteCourse(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean success = coursesService.deleteCourseById(id);
            if(success) {
                response.put("success", true);
                return ResponseEntity.ok(response);
            }else {
                response.put("success", false);
                response.put("error", "Курс с id " + id + " не найден");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        }catch (Exception e) {
            log.error("Error deleting course id {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "error", "An internal server error occurred."
            ));
        }
    }

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
                                    "сообщение об ошибке не указано"
                            )
                    ));
            return ResponseEntity.badRequest().body(ApiResponse.validationError(errors));
        }

        try {
            Course savedCourse = coursesService.createCourse(courseRequest, imageFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Курс успешно создан", savedCourse));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (IOException e) {
            log.error("File upload failed for course: {}", courseRequest.getTitle(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Ошибка при загрузке файла."));
        }
    }

    @PostMapping("/admin/courses/update")
    public ResponseEntity<ApiResponse<?>> updateCourse(@ModelAttribute CourseUpdateRequest courseUpdateRequest) {
        try {
            Course updatedCourse = coursesService.updateCourse(courseUpdateRequest);
            return ResponseEntity.ok(ApiResponse.success("Курс успешно обновлен", Map.of("courseId", updatedCourse.getId())));
        } catch (IOException e) {
            log.error("File upload error during course update: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Ошибка при загрузке файла."));
        } catch (IllegalArgumentException e) {
            log.warn("Invalid data for course update: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error updating course: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Внутренняя ошибка сервера."));
        }
    }

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
                                    "Validation error"
                            )
                    ));
            return ResponseEntity.badRequest()
                    .body(ApiResponse.validationError(errors));
        }

        try {
            // Проверка валидности статуса
            CourseStatus.valueOf(dto.getStatus());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Такого статуса не существует"));
        }

        try {
            boolean isUpdated = coursesService.updateCourseStatus(dto.getStatus(), dto.getCourseId());

            if (isUpdated) {
                return ResponseEntity.ok()
                        .body(ApiResponse.success("Статус успешно обновлен",
                                Map.of("status", dto.getStatus())));
            } else {
                log.warn("Course status not updated for courseId: {}", dto.getCourseId());
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(ApiResponse.error("Статус не был изменен"));
            }

        } catch (EntityNotFoundException e) {
            log.warn("Course not found: {}", dto.getCourseId());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Курс не найден"));

        } catch (Exception e) {
            log.error("Error updating course status for courseId: {}", dto.getCourseId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Внутренняя ошибка сервера"));
        }
    }
}