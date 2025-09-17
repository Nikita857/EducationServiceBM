package com.bm.education.api;

import com.bm.education.dto.OfferDto;
import com.bm.education.models.Offer;
import com.bm.education.models.User;
import com.bm.education.repositories.UserRepository;
import com.bm.education.services.OfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller for handling offer-related requests.
 */
@RequiredArgsConstructor
@RestController

@RequestMapping("/api/offer")
public class OfferController {

    private final OfferService offerService;
    private final UserRepository userRepository;

    /**
     * Submits a new offer.
     *
     * @param offerDto The DTO containing the offer details.
     * @param result The result of the validation.
     * @return A response entity indicating that the offer was submitted successfully.
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> submitOffer(
            @Valid @RequestBody OfferDto offerDto,
            BindingResult result) {

        

        if (result.hasErrors()) {
            Map<String, String> errors = result.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            fieldError -> fieldError.getDefaultMessage() != null
                                    ? fieldError.getDefaultMessage()
                                    : "Validation error"
                    ));

            

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "success", false,
                            "message", "Ошибка валидации",
                            "errors", errors
                    ));
        }

        try {
            User user = userRepository.findById(offerDto.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Пользователь не найден"));

            Offer offer = new Offer();
            offer.setUser(user);
            offer.setTopic(offerDto.getTopic());
            offer.setDescription(offerDto.getDescription());

            Offer savedOffer = offerService.saveOffer(offer);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Форма успешно отправлена!",
                    "data", Map.of(
                            "id", savedOffer.getId(),
                            "topic", savedOffer.getTopic()
                    )
            ));

        } catch (Exception e) {
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Внутренняя ошибка сервера"
                    ));
        }
    }
}