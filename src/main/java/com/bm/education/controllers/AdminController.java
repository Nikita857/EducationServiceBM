package com.bm.education.controllers;

import com.bm.education.dto.CourseCreateRequest;
import com.bm.education.dto.OfferDto;
import com.bm.education.dto.OfferResponseDto;
import com.bm.education.models.Course;
import com.bm.education.models.Offer;
import com.bm.education.models.OfferStatus;
import com.bm.education.models.Role;
import com.bm.education.services.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@Slf4j
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final CoursesService coursesService;
    private final ModuleService moduleService;
    private final LessonService lessonService;
    private final OfferService offerService;

    @GetMapping("/admin")
    public String admin(Authentication auth, Model model) {
        if(userService.getUserByUsername(auth.getName()) != null) {
            if(userService.getUserByUsername(auth.getName()).getRoles().contains(Role.ROLE_ADMIN)) {

                model.addAttribute("admin", userService.getUserByUsername(auth.getName()));
                model.addAttribute("users", userService.getAllUsers());
                model.addAttribute("courses", coursesService.getAllCourses());
                model.addAttribute("modules", moduleService.getAllModules());
                model.addAttribute("lessons", lessonService.getAllLessons());
                model.addAttribute("offers", offerService.getAllOffers());
                model.addAttribute("uncheckedOffers", offerService.getOffersWithStatus(OfferStatus.PENDING.toString()));
                return "admin";
            }
            return "redirect:/";
        }
        return "redirect:/login";
    }

    @GetMapping("admin/offers/{offerId}")
    public ResponseEntity<OfferDto> getOfferById(@PathVariable Integer offerId) {
        try {
            OfferDto offerDto = offerService.getOfferById(offerId);
            log.debug(ResponseEntity.ok(offerDto).toString());
            return ResponseEntity.ok(offerDto);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Обновление ответа и статуса
    @PostMapping("admin/updateOffer")
    public ResponseEntity<Map<String, Object>> updateOffer(
            @Valid @RequestBody OfferResponseDto updateDto,
            BindingResult bindingResult) {

        log.debug("Received offer update: {}", updateDto);

        Map<String, Object> response = new HashMap<>();

        // Проверка ошибок валидации
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            fieldError -> fieldError.getDefaultMessage()
                    ));

            response.put("success", false);
            response.put("errors", errors);
            log.warn("Validation failed: {}", errors);

            return ResponseEntity.badRequest().body(response);
        }

        try {
            // Обновляем заявку
            Offer updatedOffer = offerService.updateAdminResponse(updateDto);

            response.put("success", true);
            response.put("message", "Заявка успешно обновлена");
            response.put("data", Map.of(
                    "id", updatedOffer.getId(),
                    "status", updatedOffer.getStatus()
            ));

            log.info("Offer {} updated successfully", updateDto.getOfferId());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Ошибка при обновлении заявки");
            log.error("Error updating offer: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/admin/course/create")
    public String createCourse(
            @Valid @ModelAttribute("course") CourseCreateRequest courseRequest,
            BindingResult bindingResult,
            @RequestParam("image") MultipartFile imageFile,
            RedirectAttributes redirectAttributes) {

        // Проверяем валидацию
        log.debug("Проверка валидации в контроллере");
        if (bindingResult.hasErrors()) {
            return "admin";
        }

        // Проверяем размер файла
        log.debug("Проверка размера файла в контроллере");
        if (imageFile != null && !imageFile.isEmpty() && imageFile.getSize() > 5 * 1024 * 1024) {
            bindingResult.rejectValue("image", "file.size", "Размер файла не должен превышать 5MB");
            return "admin";
        }

        // Проверяем тип файла
        if (imageFile != null && !imageFile.isEmpty()) {
            String contentType = imageFile.getContentType();
            if (contentType == null ||
                    (!contentType.equals("image/jpeg") &&
                            !contentType.equals("image/png") &&
                            !contentType.equals("image/gif"))) {
                bindingResult.rejectValue("image", "file.type",
                        "Разрешены только файлы JPG, PNG или GIF");
                return "admin";
            }
        }

        try {
            // Конвертируем DTO в Entity
            log.info("Вносим данные из дто в энтити");
            Course course = new Course();
            course.setTitle(courseRequest.getTitle());
            course.setSlug(courseRequest.getSlug());
            course.setDescription(courseRequest.getDescription());
            log.info("Course {}", course);

            // Сохраняем курс
            log.info("Сохранение кусра");
            Course savedCourse = coursesService.createCourse(course, imageFile);
            log.info("Course saved");


            return "redirect:/admin";

        } catch (IllegalArgumentException e) {
            bindingResult.rejectValue("slug", "course.slug.duplicate", e.getMessage());
            return "admin";
        } catch (IOException e) {
            bindingResult.reject("file.upload.error", "Ошибка при загрузке изображения");
            return "admin";
        }
    }
    @GetMapping("/admin/modules/create")
    public String addModule() {
        return "admin/addModule";
    }
}
