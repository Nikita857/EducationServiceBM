package com.bm.education.controllers;

import com.bm.education.dto.CourseResponseDTO;
import com.bm.education.services.CoursesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
public class AdminCoursesController {

    private final CoursesService coursesService;

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
}
