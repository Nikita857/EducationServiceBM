package com.bm.education.controllers;

import com.bm.education.dto.LessonRequestDTO;
import com.bm.education.dto.ModuleCreateRequest;
import com.bm.education.dto.ModuleResponseDTO;
import com.bm.education.dto.ModuleUpdateRequest;
import com.bm.education.models.Module;
import com.bm.education.models.ModuleStatus;
import com.bm.education.repositories.CoursesRepository;
import com.bm.education.repositories.ModuleRepository;
import com.bm.education.services.CoursesService;
import com.bm.education.services.LessonService;
import com.bm.education.services.ModuleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
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
    private final CoursesRepository coursesRepository;
    private final LessonService lessonService;
    private final ModuleRepository moduleRepository;

    @GetMapping("/admin/modules")
    public ResponseEntity<?> getModulesWithPagination(@RequestParam(defaultValue = "1") int page,
                                                      @RequestParam(defaultValue = "10") int size)
    {
        Map<String, Object> response = new HashMap<>();
        try {
            Page<ModuleResponseDTO> modules = moduleService.putModulesInDTO(page, size);

            response.put("success", true);
            response.put("modules", modules.getContent());
            response.put("currentPage", modules.getNumber() + 1);
            response.put("totalPages", modules.getTotalPages());
            response.put("totalItems", modules.getTotalElements());
            response.put("pageSize", size);

            return ResponseEntity.ok(response);
        }catch (Exception e){
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/admin/modules/json")
    public ResponseEntity<?> sendModulesJson() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<ModuleResponseDTO> modules = moduleService.getAllModulesByDTO();
            response.put("success", true);
            response.put("modules", modules);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/admin/module/{id}")
    public ResponseEntity<?> getModuleById(@PathVariable("id") int id) {
        Map<String, Object> response = new HashMap<>();
        try {
            ModuleResponseDTO module = moduleService.findModuleById(id);
            if(module != null) {
                response.put("success", true);
                response.put("module", module);
                return ResponseEntity.ok(response);
            }
            response.put("success", false);
            response.put("module", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/admin/modules/updateStatus/{id}/{status}")
    public ResponseEntity<?> updateModuleStatus(@PathVariable Integer id, @PathVariable ModuleStatus status) {
        Map<String, String> response = new HashMap<>();
        try {
            if(moduleService.updateModuleStatus(id, status)) {
                response.put("message", String.format("Статус модуля %d обновлен на %s", id, status));
                return ResponseEntity.ok(response);
            }
            response.put("message", String.format("Ошибка обновления статуса для модуля %d", id));
            response.put("error", "Модуля с таким id не существует");
            return ResponseEntity.badRequest().body(response);
        }catch (Exception e){
            response.put("error", e.getMessage());
            response.put("message", String.format("Ошибка обновления статуса для модуля %d", id));
            return ResponseEntity.badRequest().body(response);
        }
    }



    @PostMapping("/admin/module/{id}/delete")
    ResponseEntity<?> deleteModule(@PathVariable Integer id) {

        Map<String, String> response = new HashMap<>();

        try{
            moduleService.deleteModule(id);
            response.put("message", String.format("Модуль %s успешно удален", id));
            return ResponseEntity.ok(response);
        }catch (Exception e){
            response.put("success", "false");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/admin/modules/create")
    ResponseEntity<?> addModule(@Valid @RequestBody ModuleCreateRequest mcr, BindingResult bindingResult, Model model) {
        try {
            Map<String, Object> response = new HashMap<>();

            if(bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(fieldError -> {
                    errors.put(fieldError.getField(), fieldError.getDefaultMessage());
                });
                response.put("success", "false");
                response.put("errors", errors);
                return ResponseEntity.badRequest().body(response);
            }

            if(moduleService.createModule(mcr, coursesRepository)) {
                response.put("success", "true");
                response.put("message", "Created the new module");
                return ResponseEntity.ok(response);
            }
        }catch (Exception e){
            throw new RuntimeException(String.format("Не удалось создать модуль. Ошибка: %s", e.getMessage()));
        }
        return null;
    }

    @GetMapping("/admin/modules/{id}/lessons")
    ResponseEntity<List<LessonRequestDTO>> getModuleLessons(@PathVariable Integer id) {
        try {
            List<LessonRequestDTO> moduleLessons = lessonService.getModuleLessons(id);
            return !moduleLessons.isEmpty() ? ResponseEntity.ok(moduleLessons) : ResponseEntity.notFound().build();
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/admin/modules/update")
    public ResponseEntity<?> updateModule(@Valid @RequestBody ModuleUpdateRequest request,
                                          BindingResult bindingResult) {
        Map<String, Object> response = new HashMap<>();

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(fieldError -> {
                errors.put(fieldError.getField(), fieldError.getDefaultMessage());
            });
            response.put("success", "false");
            response.put("errors", errors);
            return ResponseEntity.badRequest().body(response);
        }
        try {
            boolean success = moduleService.updateModule(request);
            if (success) {
                response.put("success", true);
                response.put("message", "Module updated successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("error", "Failed to update module");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
