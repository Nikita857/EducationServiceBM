package com.bm.education.controllers;

import com.bm.education.dto.CourseResponseDTO;
import com.bm.education.dto.ModuleResponseDTO;
import com.bm.education.services.CoursesService;
import com.bm.education.services.ModuleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
public class AdminCoursesController {

    private final CoursesService coursesService;
    private final ModuleService moduleService;

    @GetMapping("/admin/courses")
    public ResponseEntity<?> sendUsersJson(@RequestParam(defaultValue = "1", name = "page") int page,
                                           @RequestParam(defaultValue = "10", required = false, name = "size") int size) {
        try {
            Map<String, Object> response = new HashMap<>();

            Page<CourseResponseDTO> courseResponseDTOS  = coursesService.getCoursesForDTO(page, size);

            response.put("success", true);
            response.put("courses", courseResponseDTOS.getContent());
            response.put("currentPage", courseResponseDTOS.getNumber() + 1); // Spring Data pages are 0-based
            response.put("totalPages", courseResponseDTOS.getTotalPages());
            response.put("totalItems", courseResponseDTOS.getTotalElements());
            response.put("pageSize", size);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting courses: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Internal server error"));
        }
    }

    @GetMapping("/admin/courses/{id}/modules")
    public ResponseEntity<?> getCourseModules(@PathVariable int id) {
        try {
            Map<String, Object> response = new HashMap<>();
            List<ModuleResponseDTO> modules = coursesService.getModulesOfCourse(id);
            if(modules != null && !modules.isEmpty()) {
                response.put("success", true);
                response.put("modules", modules);
                return ResponseEntity.ok(response);
            }else{
                response.put("success", false);
                response.put("error", "Modules not found");
                return ResponseEntity.ok(response);
            }
        }catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of(
                            "success", false,
                            "error", e.getMessage()
                    )
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
                response.put("error", "Такого курса нет");
                return ResponseEntity.ok(response);
            }
        }catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
}
