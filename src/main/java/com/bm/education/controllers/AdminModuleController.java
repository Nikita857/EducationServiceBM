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

@RestController
@Slf4j
@RequiredArgsConstructor
public class AdminModuleController {

    private final ModuleService moduleService;
    private final LessonService lessonService;
    @GetMapping("/admin/modules")
    public ResponseEntity<?> getModulesWithPagination(@RequestParam(defaultValue = "1") int page,
                                                      @RequestParam(defaultValue = "10") int size,
                                                      @RequestParam(defaultValue = "0") int courseId)
    {
        try {
            Page<ModuleResponseDTO> modules = moduleService.putModulesInDTO(page, size, courseId);
            return ResponseEntity.ok(ApiResponse.paginated(modules));
        }catch (Exception e){
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(String.format("Internal server error %s", e.getMessage()))
            );
        }
    }

    @GetMapping("/admin/modules/json")
    public ResponseEntity<?> sendModulesJson() {
        try {
            List<ModuleResponseDTO> modules = moduleService.getAllModulesByDTO();
            return ResponseEntity.ok(
                    ApiResponse.success("success", modules)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(String.format("Internal Server Error: %s", e.getMessage()))
            );
        }
    }

    @GetMapping("/admin/module/{id}")
    public ResponseEntity<?> getModuleById(@PathVariable("id") int id) {
        try {
            ModuleResponseDTO module = moduleService.findModuleById(id);
            if(module != null) {
                return ResponseEntity.ok(
                        ApiResponse.success("module", module)
                );
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ApiResponse.error(String.format("Module not found: %s", id))
            );
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(String.format("Internal Server Error: %s", e.getMessage()))
            );
        }
    }

    @PostMapping("/admin/modules/updateStatus/{id}/{status}")
    public ResponseEntity<?> updateModuleStatus(@PathVariable Integer id, @PathVariable ModuleStatus status) {
        try {
            if(moduleService.updateModuleStatus(id, status)) {
                return ResponseEntity.ok(
                        ApiResponse.success(String.format("Статус модуля %d обновлен на %s", id, status))
                );
            }
            return ResponseEntity.badRequest().body(
                    ApiResponse.error(String.format("Ошибка обновления статуса для модуля %d", id))
            );
        }catch (Exception e){
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(String.format("Internal server error %s", e.getMessage()))
            );
        }
    }



    @PostMapping("/admin/module/{id}/delete")
    ResponseEntity<?> deleteModule(@PathVariable Integer id) {
        try{
            moduleService.deleteModule(id);
            return ResponseEntity.ok(
                    ApiResponse.success(String.format("Модуль %d успешно удален", id))
            );
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ApiResponse.error(String.format("Не удалось удалить модуль. Ошибка %s", e.getMessage()))
            );
        }
    }

    @PostMapping("/admin/modules/create")
    public ResponseEntity<?> addModule(@Valid @RequestBody ModuleCreateRequest mcr, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(fieldError ->
                    errors.put(fieldError.getField(), fieldError.getDefaultMessage()));

            return ResponseEntity.badRequest().body(
                    ApiResponse.validationError(errors)
            );
        }

        try {
            ModuleResponseDTO createdModule = moduleService.createModule(mcr);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    ApiResponse.success("module", createdModule)
            );

        } catch (Exception e) {
            log.error("Ошибка при создании модуля: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(String.format("Internal server error %s", e.getMessage()))
            );
        }
    }

    @GetMapping("/admin/modules/{id}/lessons")
    ResponseEntity<?> getModuleLessons(@PathVariable String id) {
        try {
            List<LessonRequestDTO> moduleLessons = lessonService.getModuleLessons(Integer.parseInt(id));
            if(!moduleLessons.isEmpty()) {
                return ResponseEntity.ok(
                       ApiResponse.success("moduleLessons", moduleLessons)
                );
            }else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        ApiResponse.error("Lessons not found")
                );
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(String.format("Internal server error %s", e.getMessage()))
            );
        }
    }

    @PostMapping("/admin/modules/update")
    public ResponseEntity<?> updateModule(@Valid @RequestBody ModuleUpdateRequest request,
                                          BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(fieldError ->
                    errors.put(fieldError.getField(), fieldError.getDefaultMessage()));

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ApiResponse.validationError(errors)
            );
        }
        try {
            boolean success = moduleService.updateModule(request);
            if (success) {
                return ResponseEntity.ok(
                        ApiResponse.success("Module successfully updated")
                );
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                        ApiResponse.error("Error updating module update")
                );
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(String.format("Internal server error %s", e.getMessage()))
            );
        }
    }
}
