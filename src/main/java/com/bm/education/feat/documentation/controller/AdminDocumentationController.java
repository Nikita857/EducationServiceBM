package com.bm.education.feat.documentation.controller;

import com.bm.education.shared.common.ApiResponse;
import com.bm.education.feat.course.dto.CourseResponseDTO;
import com.bm.education.feat.documentation.dto.DocumentationCategoryDTO;
import com.bm.education.feat.documentation.dto.DocumentationObjectCreateRequest;
import com.bm.education.feat.documentation.dto.DocumentationObjectDTO;
import com.bm.education.feat.documentation.dto.DocumentationObjectResponseDTO;
import com.bm.education.feat.documentation.model.DocumentationObject;
import com.bm.education.feat.course.service.CoursesService;
import com.bm.education.feat.documentation.service.DocumentationObjectService;
import com.bm.education.feat.documentation.mapper.DocumentationMapper;
import com.bm.education.feat.documentation.repository.DocumentationCategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminDocumentationController {

    private final DocumentationObjectService documentationObjectService;
    private final CoursesService coursesService;
    private final DocumentationCategoryRepository documentationCategoryRepository;
    private final DocumentationMapper documentationMapper;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/documents")
    public ResponseEntity<ApiResponse<?>> getDocuments(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) Integer courseId,
            @RequestParam(required = false) Long categoryId) {
        try {
            Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
            Pageable pageable = PageRequest.of(page - 1, size, sort);
            Page<DocumentationObjectDTO> documents = documentationObjectService.getDocuments(pageable, courseId,
                    categoryId);
            return ResponseEntity.ok(ApiResponse.paginated(documents));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(String.format("Internal server error: %s", e.getMessage())));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/documents/courses")
    public ResponseEntity<ApiResponse<?>> getCoursesForFilter() {
        try {
            List<CourseResponseDTO> courses = coursesService.findCoursesAndWriteDTO();
            return ResponseEntity.ok(ApiResponse.success(courses));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(String.format("Internal server error: %s", e.getMessage())));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/documents/categories")
    public ResponseEntity<ApiResponse<?>> getCategoriesForFilter(@RequestParam(required = false) Long courseId) {
        try {
            List<DocumentationCategoryDTO> categories;
            if (courseId != null) {
                categories = documentationCategoryRepository.findAllProjectedToDtoByCourseId(courseId);
            } else {
                categories = documentationCategoryRepository.findAllProjectedToDto();
            }
            return ResponseEntity.ok(ApiResponse.success(categories));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(String.format("Internal server error: %s", e.getMessage())));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/documents/{id}/delete")
    public ResponseEntity<ApiResponse<?>> deleteDocument(@PathVariable Long id) {
        try {
            documentationObjectService.deleteDocument(id);
            return ResponseEntity.ok(ApiResponse.success("Документ успешно удален"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error("Ошибка при удалении файла, связанного с документом."));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/documents/create")
    public ResponseEntity<ApiResponse<?>> createDocument(
            @Valid @ModelAttribute DocumentationObjectCreateRequest request,
            BindingResult bindingResult) {
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
            DocumentationObject savedDoc = documentationObjectService.createDocument(request);
            DocumentationObjectResponseDTO responseDto = documentationMapper.toResponseDto(savedDoc);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Документ успешно создан", responseDto));
        } catch (IllegalArgumentException | EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Ошибка при загрузке файла."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Внутренняя ошибка сервера: " + e.getMessage()));
        }
    }
}
