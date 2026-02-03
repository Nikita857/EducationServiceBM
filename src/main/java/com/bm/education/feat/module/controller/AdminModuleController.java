package com.bm.education.feat.module.controller;

import com.bm.education.shared.common.ApiResponse;
import com.bm.education.feat.lesson.dto.LessonListResponse;
import com.bm.education.feat.module.dto.ModuleCreateRequest;
import com.bm.education.feat.module.dto.ModuleResponse;
import com.bm.education.feat.module.dto.ModuleUpdateRequest;
import com.bm.education.feat.module.model.ModuleStatus;
import com.bm.education.feat.lesson.service.LessonService;
import com.bm.education.feat.module.service.ModuleService;
import com.bm.education.shared.validation.ValidationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin REST API controller for module management.
 */
@RestController
@RequestMapping("/admin/modules")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Modules", description = "Admin module management endpoints")
public class AdminModuleController {

    private final ModuleService moduleService;
    private final LessonService lessonService;
    private final ValidationService validationService;

    /**
     * Get paginated list of modules.
     */
    @GetMapping
    @Operation(summary = "Get modules paginated", description = "Returns paginated list of modules")
    public ApiResponse<ApiResponse.PaginatedPayload<ModuleResponse>> getModulesPaginated(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") Long courseId) {
        Page<ModuleResponse> modules = moduleService.putModulesInDTO(page, size, courseId);
        return ApiResponse.paginated(modules);
    }

    /**
     * Get all modules.
     */
    @GetMapping("/all")
    @Operation(summary = "Get all modules", description = "Returns all modules as list")
    public ApiResponse<List<ModuleResponse>> getAllModules() {
        List<ModuleResponse> modules = moduleService.getAllModulesByDTO();
        return ApiResponse.success(modules);
    }

    /**
     * Get module by ID.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get module by ID", description = "Returns module details")
    public ApiResponse<ModuleResponse> getModuleById(@PathVariable Long id) {
        ModuleResponse module = moduleService.findModuleById(id);
        return ApiResponse.success(module);
    }

    /**
     * Get lessons for a module.
     */
    @GetMapping("/{id}/lessons")
    @Operation(summary = "Get module lessons", description = "Returns all lessons for a module")
    public ApiResponse<List<LessonListResponse>> getModuleLessons(@PathVariable Long id) {
        List<LessonListResponse> lessons = lessonService.getModuleLessons(id);
        return ApiResponse.success(lessons);
    }

    /**
     * Create a new module.
     */
    @PostMapping
    @Operation(summary = "Create module", description = "Creates a new module")
    public ApiResponse<ModuleResponse> createModule(
            @Valid @RequestBody ModuleCreateRequest request,
            BindingResult bindingResult) {
        validationService.validate(bindingResult);
        ModuleResponse createdModule = moduleService.createModule(request);
        return ApiResponse.success("Модуль успешно создан", createdModule);
    }

    /**
     * Update a module.
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update module", description = "Updates an existing module")
    public ApiResponse<Void> updateModule(
            @PathVariable Long id,
            @Valid @RequestBody ModuleUpdateRequest request,
            BindingResult bindingResult) {
        validationService.validate(bindingResult);
        moduleService.updateModule(request);
        return ApiResponse.success("Модуль успешно обновлен");
    }

    /**
     * Update module status.
     */
    @PatchMapping("/{id}/status")
    @Operation(summary = "Update module status", description = "Updates the status of a module")
    public ApiResponse<Void> updateModuleStatus(
            @PathVariable Long id,
            @RequestParam ModuleStatus status) {
        moduleService.updateModuleStatus(id, status);
        return ApiResponse.success("Статус модуля обновлен");
    }

    /**
     * Delete a module.
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete module", description = "Deletes a module by ID")
    public ApiResponse<Void> deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
        return ApiResponse.success("Модуль успешно удален");
    }
}