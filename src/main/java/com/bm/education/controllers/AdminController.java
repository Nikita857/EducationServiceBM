package com.bm.education.controllers;

import com.bm.education.api.ApiResponse;
import com.bm.education.dto.OfferDto;
import com.bm.education.dto.OfferResponseDto;
import com.bm.education.models.*;
import com.bm.education.services.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Controller for handling admin-related requests.
 */
@Controller

@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final CoursesService coursesService;
    private final ModuleService moduleService;
    private final LessonService lessonService;
    private final OfferService offerService;

    /**
     * Displays the admin dashboard.
     *
     * @param auth The authentication object for the current user.
     * @param model The model to add attributes to.
     * @return The name of the admin view, or a redirect to the index or login page.
     */
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

    /**
     * Gets an offer by its ID.
     *
     * @param offerId The ID of the offer to get.
     * @return A response entity containing the offer.
     */
    @GetMapping("admin/offers/{offerId}")
    public ResponseEntity<ApiResponse<OfferDto>> getOfferById(@PathVariable Integer offerId) {
        try {
            OfferDto offerRequestDTO = offerService.getOfferById(offerId);
            return ResponseEntity.ok(
                    ApiResponse.success(offerRequestDTO));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Updates an offer.
     *
     * @param updateDto The DTO containing the updated offer details.
     * @param bindingResult The result of the validation.
     * @return A response entity indicating that the offer was updated successfully.
     */
    // Обновление ответа и статуса
    @PostMapping("admin/updateOffer")
    public ResponseEntity<ApiResponse<?>> updateOffer(
            @Valid @RequestBody OfferResponseDto updateDto,
            BindingResult bindingResult) {

        // Проверка ошибок валидации
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            fieldError -> Objects.requireNonNull(fieldError.getDefaultMessage()).isEmpty()?fieldError.getDefaultMessage() : ""
                    ));

            return ResponseEntity.badRequest().body(ApiResponse.validationError(errors));
        }

        try {
            // Обновляем заявку
            Offer updatedOffer = offerService.updateAdminResponse(updateDto);

            return ResponseEntity.ok(ApiResponse.success("Заявка успешно обновлена", Map.of(
                    "id", updatedOffer.getId(),
                    "status", updatedOffer.getStatus()
            )));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Ошибка при обновлении заявки"));
        }
    }

    /**
     * Displays the add module page.
     *
     * @return The name of the add module view.
     */
    @GetMapping("/admin/modules/create")
    public String addModule() {
        return "admin/addModule";
    }

    /**
     * Displays the video page.
     *
     * @param name The name of the video.
     * @param model The model to add attributes to.
     * @return The name of the video view.
     */
    @GetMapping("/admin/video/{name}")
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