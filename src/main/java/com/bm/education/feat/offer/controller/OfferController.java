package com.bm.education.feat.offer.controller;

import com.bm.education.feat.offer.dto.OfferDto;
import com.bm.education.feat.offer.dto.OfferResponse;
import com.bm.education.feat.offer.model.Offer;
import com.bm.education.feat.user.model.User;
import com.bm.education.feat.user.repository.UserRepository;
import com.bm.education.feat.offer.service.OfferService;
import com.bm.education.shared.common.ApiResponse;
import com.bm.education.shared.exception.ResourceNotFoundException;
import com.bm.education.shared.validation.ValidationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for handling offer-related requests.
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/offers")
@Tag(name = "Offers", description = "User offer management")
public class OfferController {

        private final OfferService offerService;
        private final UserRepository userRepository;
        private final ValidationService validationService;

        /**
         * Submits a new offer.
         *
         * @param offerDto      The DTO containing the offer details.
         * @param bindingResult The result of the validation.
         * @return ApiResponse with created offer data.
         */
        @PostMapping
        @Operation(summary = "Submit offer", description = "Creates a new user offer/request")
        public ApiResponse<OfferResponse> submitOffer(
                        @Valid @RequestBody OfferDto offerDto,
                        BindingResult bindingResult) {

                validationService.validate(bindingResult);

                User user = userRepository.findById(offerDto.userId())
                                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", offerDto.userId()));

                Offer offer = new Offer();
                offer.setUser(user);
                offer.setTopic(offerDto.topic());
                offer.setDescription(offerDto.description());

                Offer savedOffer = offerService.saveOffer(offer);

                OfferResponse response = new OfferResponse(
                                savedOffer.getId(),
                                savedOffer.getTopic(),
                                savedOffer.getDescription(),
                                savedOffer.getStatus().name());

                return ApiResponse.success("Форма успешно отправлена!", response);
        }
}