package com.bm.education.controllers;

import com.bm.education.dto.LessonRequestDTO;
import com.bm.education.dto.ModuleCreateRequest;
import com.bm.education.dto.ModuleResponseDTO;
import com.bm.education.models.ModuleStatus;
import com.bm.education.repositories.CoursesRepository;
import com.bm.education.services.CoursesService;
import com.bm.education.services.LessonService;
import com.bm.education.services.ModuleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@Slf4j
@RequiredArgsConstructor
public class AdminModuleController {

    private final ModuleService moduleService;
    private final CoursesService coursesService;
    private final CoursesRepository coursesRepository;
    private final LessonService lessonService;

    @GetMapping("/admin/modules")
    public String addModule(Model model, @RequestParam(value = "courseId", required = false) String id) {

        if(id != null && !id.equals("all")){
            model.addAttribute("modules", moduleService.getModulesByCourseId(Integer.parseInt(id)));
        }else{
            model.addAttribute("modules", moduleService.getAllModules());
        }
        model.addAttribute("courses", coursesService.getAllCourses());
        return "adminModule";
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
}
