package com.bm.education.controllers;

import com.bm.education.api.ApiResponse;
import com.bm.education.dto.LessonRequestDTO;
import com.bm.education.dto.ModuleCreateRequest;
import com.bm.education.dto.ModuleResponseDTO;
import com.bm.education.dto.ModuleUpdateRequest;
import com.bm.education.models.ModuleStatus;
import com.bm.education.services.LessonService;
import com.bm.education.services.ModuleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller for handling admin-related module requests.
 */
@Slf4j
@RestController

@RequiredArgsConstructor
public class AdminModuleController {

    private final ModuleService moduleService;
    private final LessonService lessonService;

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
    public ResponseEntity<?> getModulesWithPagination(@RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") Long courseId) {
        try {
            Page<ModuleResponseDTO> modules = moduleService.putModulesInDTO(page, size, courseId);
            return ResponseEntity.ok(ApiResponse.paginated(modules));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(String.format("Internal server error %s", e.getMessage())));
        }
    }

    /**
     * Gets all modules as a JSON response.
     *
     * @return A response entity containing a list of all modules.
     */
    @GetMapping("/admin/modules/json")
    public ResponseEntity<?> sendModulesJson() {
        try {
            List<ModuleResponseDTO> modules = moduleService.getAllModulesByDTO();
            return ResponseEntity.ok(
                    ApiResponse.success(modules));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(String.format("Internal Server Error: %s", e.getMessage())));
        }
    }

    /**
     * Gets a module by its ID.
     *
     * @param id The ID of the module to get.
     * @return A response entity containing the module.
     */
    @GetMapping("/admin/module/{id}")
    public ResponseEntity<?> getModuleById(@PathVariable("id") Long id) {
        try {
            ModuleResponseDTO module = moduleService.findModuleById(id);
            if (module != null) {
                return ResponseEntity.ok(
                        ApiResponse.success(module));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ApiResponse.error(String.format("Module not found: %s", id)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(String.format("Internal Server Error: %s", e.getMessage())));
        }
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
    public ResponseEntity<?> updateModuleStatus(@PathVariable Long id, @PathVariable ModuleStatus status) {
        try {
            if (moduleService.updateModuleStatus(id, status)) {
                return ResponseEntity.ok(
                        ApiResponse.success(String.format("Статус модуля %d обновлен на %s", id, status)));
            }
            return ResponseEntity.badRequest().body(
                    ApiResponse.error(String.format("Ошибка обновления статуса для модуля %d", id)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(String.format("Internal server error %s", e.getMessage())));
        }
    }

    /**
     * Deletes a module by its ID.
     *
     * @param id The ID of the module to delete.
     * @return A response entity indicating that the module was deleted
     *         successfully.
     */
    @PostMapping("/admin/module/{id}/delete")
    ResponseEntity<?> deleteModule(@PathVariable Long id) {
        try {
            moduleService.deleteModule(id);
            return ResponseEntity.ok(
                    ApiResponse.success(String.format("Модуль %d успешно удален", id)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ApiResponse.error(String.format("Не удалось удалить модуль. Ошибка %s", e.getMessage())));
        }
    }

    /**
     * Adds a new module.
     *
     * @param mcr           The request object containing the module details.
     * @param bindingResult The result of the validation.
     * @return A response entity containing the created module.
     */
    @PostMapping("/admin/modules/create")
    public ResponseEntity<?> addModule(@Valid @RequestBody ModuleCreateRequest mcr, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors()
                    .forEach(fieldError -> errors.put(fieldError.getField(), fieldError.getDefaultMessage()));

            return ResponseEntity.badRequest().body(
                    ApiResponse.validationError(errors));
        }

        try {
            ModuleResponseDTO createdModule = moduleService.createModule(mcr);

            return ResponseEntity.status(HttpStatus.OK).body(
                    ApiResponse.success(createdModule));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(String.format("Internal server error %s", e.getMessage())));
        }
    }

    /**
     * Gets all lessons for a module.
     *
     * @param id The ID of the module.
     * @return A response entity containing a list of all lessons for the module.
     */
    @GetMapping("/admin/modules/{id}/lessons")
    ResponseEntity<?> getModuleLessons(@PathVariable Long id) {
        try {
            List<LessonRequestDTO> moduleLessons = lessonService.getModuleLessons(id);
            log.debug("Module lessons {}", moduleLessons);
            if (!moduleLessons.isEmpty()) {
                return ResponseEntity.ok(
                        ApiResponse.success(moduleLessons));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        ApiResponse.error("Lessons not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(String.format("Internal server error %s", e.getMessage())));
        }
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
    public ResponseEntity<?> updateModule(@Valid @RequestBody ModuleUpdateRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors()
                    .forEach(fieldError -> errors.put(fieldError.getField(), fieldError.getDefaultMessage()));

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ApiResponse.validationError(errors));
        }
        try {
            boolean success = moduleService.updateModule(request);
            if (success) {
                return ResponseEntity.ok(
                        ApiResponse.success("Module successfully updated"));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                        ApiResponse.error("Error updating module update"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(String.format("Internal server error %s", e.getMessage())));
        }
    }
}