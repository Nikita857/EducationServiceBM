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
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for handling admin-related module requests.
 */
@Slf4j
@RestController

@RequiredArgsConstructor
public class AdminModuleController {

    private final ModuleService moduleService;
    private final LessonService lessonService;
    private final ValidationService validationService;

    /**
     * Gets a paginated list of modules.
     *
     * @param page     The page number.
     * @param size     The page size.
     * @param courseId The ID of the course to filter by, or 0 to retrieve all
     *                 modules.
     * @return A response entity containing the paginated list of modules.
     */
    @GetMapping("/admin/modules")
    public ApiResponse<ApiResponse.PaginatedPayload<ModuleResponse>> getModulesWithPagination(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") Long courseId) {
        Page<ModuleResponse> modules = moduleService.putModulesInDTO(page, size, courseId);
        return ApiResponse.paginated(modules);
    }

    /**
     * Gets all modules as a JSON response.
     *
     * @return A response entity containing a list of all modules.
     */
    @GetMapping("/admin/modules/json")
    public ApiResponse<List<ModuleResponse>> sendModulesJson() {
        List<ModuleResponse> modules = moduleService.getAllModulesByDTO();
        return ApiResponse.success(modules);
    }

    /**
     * Gets a module by its ID.
     *
     * @param id The ID of the module to get.
     * @return A response entity containing the module.
     */
    @GetMapping("/admin/module/{id}")
    public ApiResponse<ModuleResponse> getModuleById(@PathVariable("id") Long id) {
        ModuleResponse module = moduleService.findModuleById(id);
        return ApiResponse.success(module);
    }

    /**
     * Updates the status of a module.
     *
     * @param id     The ID of the module to update.
     * @param status The new status of the module.
     * @return A response entity indicating that the module status was updated
     *         successfully.
     */
    @PostMapping("/admin/modules/updateStatus/{id}/{status}")
    public ApiResponse<Void> updateModuleStatus(@PathVariable Long id, @PathVariable ModuleStatus status) {
        moduleService.updateModuleStatus(id, status);
        return ApiResponse.success(String.format("Статус модуля %d обновлен на %s", id, status));
    }

    /**
     * Deletes a module by its ID.
     *
     * @param id The ID of the module to delete.
     * @return A response entity indicating that the module was deleted
     *         successfully.
     */
    @PostMapping("/admin/module/{id}/delete")
    public ApiResponse<Void> deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
        return ApiResponse.success(String.format("Модуль %d успешно удален", id));
    }

    /**
     * Adds a new module.
     *
     * @param mcr           The request object containing the module details.
     * @param bindingResult The result of the validation.
     * @return A response entity containing the created module.
     */
    @PostMapping("/admin/modules/create")
    public ApiResponse<ModuleResponse> addModule(@Valid @RequestBody ModuleCreateRequest mcr,
            BindingResult bindingResult) {
        validationService.validate(bindingResult);
        ModuleResponse createdModule = moduleService.createModule(mcr);
        return ApiResponse.success(createdModule);
    }

    /**
     * Gets all lessons for a module.
     *
     * @param id The ID of the module.
     * @return A response entity containing a list of all lessons for the module.
     */
    @GetMapping("/admin/modules/{id}/lessons")
    public ApiResponse<List<LessonListResponse>> getModuleLessons(@PathVariable Long id) {
        List<LessonListResponse> moduleLessons = lessonService.getModuleLessons(id);
        log.debug("Module lessons {}", moduleLessons);
        return ApiResponse.success(moduleLessons);
    }

    /**
     * Updates a module.
     *
     * @param request       The request object containing the updated module
     *                      details.
     * @param bindingResult The result of the validation.
     * @return A response entity indicating that the module was updated
     *         successfully.
     */
    @PostMapping("/admin/modules/update")
    public ApiResponse<Void> updateModule(@Valid @RequestBody ModuleUpdateRequest request,
            BindingResult bindingResult) {
        validationService.validate(bindingResult);
        moduleService.updateModule(request);
        return ApiResponse.success("Модуль успешно обновлен");
    }
}