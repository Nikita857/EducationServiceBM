package com.bm.education.controllers;

import com.bm.education.dto.CourseCreateRequest;
import com.bm.education.dto.OfferDto;
import com.bm.education.dto.OfferResponseDto;
import com.bm.education.models.*;
import com.bm.education.services.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PrePersist;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

import static org.springframework.security.authorization.AuthorityReactiveAuthorizationManager.hasRole;

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
        User user = userService.getUserByUsername(auth.getName());
        if (user != null) {
            if (user.getRoles().contains(Role.ROLE_ADMIN)) {
                model.addAttribute("admin", user);
                model.addAttribute("users", userService.getUsersCount());
                model.addAttribute("courses", coursesService.getCoursesCount());
                model.addAttribute("modules", moduleService.getModulesCount());
                model.addAttribute("lessons", lessonService.getLessonsCount());
                model.addAttribute("offers", offerService.getPendingOffersCount());
                model.addAttribute("offersTotal", offerService.getOffersCount());
                model.addAttribute("uncheckedOffers", offerService.getOffersWithStatus(OfferStatus.PENDING.toString()));
                return "admin";
            }
            return "redirect:/";
        }
        return "redirect:/login";
    }

    @GetMapping("admin/offers/{offerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OfferDto> getOfferById(@PathVariable Integer offerId, Authentication auth) {
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
    @PreAuthorize("hasRole('ADMIN')")
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

    @GetMapping("/admin/modules/create")
    @PreAuthorize("hasRole('ADMIN')")
    public String addModule() {
        return "admin/addModule";
    }

    @GetMapping("/admin/video/{name}")
    @PreAuthorize("hasRole('ADMIN')")
    public String watchVideoUrl (@PathVariable String name, Model model) {
        Lesson lesson = lessonService.getLessonByVideoName(name);
        if (lesson == null) {
            model.addAttribute("video", "Такого ведеоролика нет");
            model.addAttribute("title", "Видео не найдено");
        } else {
            model.addAllAttributes(Map.of(
                    "video", lesson.getVideo(),
                    "title", lesson.getTitle()
            ));
        }
        return "admin/video";
    }
}
