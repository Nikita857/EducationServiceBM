/**
 * Service for managing offers.
 */
package com.bm.education.services;

import com.bm.education.dto.OfferDto;
import com.bm.education.dto.OfferRequestDTO;
import com.bm.education.dto.OfferResponseDto;
import com.bm.education.dto.UserResponseDTO;
import com.bm.education.models.Offer;
import com.bm.education.models.OfferStatus;
import com.bm.education.repositories.OfferRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;

import org.hibernate.service.spi.ServiceException;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service class for managing offers.
 */
@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;
    private final UserService userService;

    /**
     * Saves an offer.
     *
     * @param offer The offer to save.
     * @return The saved offer.
     * @throws ValidationException if there is a validation error.
     * @throws ServiceException if there is an error while saving the offer.
     */
    @Transactional
    public Offer saveOffer(Offer offer) {
        try {
            // Убедимся, что установлены значения по умолчанию
            if (offer.getStatus() == null) {
                offer.setStatus(OfferStatus.PENDING);
            }
            if (offer.getCreatedAt() == null) {
                offer.setCreatedAt(LocalDateTime.now());
            }
            offer.setUpdatedAt(LocalDateTime.now());

            return offerRepository.save(offer);

        } catch (ConstraintViolationException e) {
            
            throw new ValidationException("Ошибка валидации: " +
                    e.getConstraintViolations().stream()
                            .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                            .collect(Collectors.joining(", ")));
        } catch (Exception e) {
            
            throw new ServiceException("Ошибка при сохранении заявки");
        }
    }

    /**
     * Gets all offers for a user.
     *
     * @param userId The ID of the user.
     * @return A list of offers for the user.
     */
    @Transactional(readOnly = true)
    public List<Offer> getUserOffers(Integer userId) {
        return offerRepository.findByUserId(userId);
    }

    /**
     * Gets all offers with a specific status.
     *
     * @param status The status of the offers to retrieve.
     * @return A list of offers with the specified status.
     */
    @Transactional(readOnly = true)
    public List<Offer> getOffersWithStatus(String status) {
        return offerRepository.findByStatus(status).isEmpty()? Collections.emptyList() : offerRepository.findByStatus(status);
    }

    /**
     * Gets an offer by its ID.
     *
     * @param id The ID of the offer.
     * @return The offer with the specified ID.
     * @throws EntityNotFoundException if the offer is not found.
     */
    @Transactional(readOnly = true)
    public OfferDto getOfferById(Integer id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Offer not found with id: " + id));

        return convertToDto(offer);
    }

    /**
     * Converts an offer to an OfferDto.
     *
     * @param offer The offer to convert.
     * @return The converted OfferDto.
     */
    public OfferDto convertToDto(@NotNull Offer offer) {
        OfferDto dto = new OfferDto();
        dto.setUserId(offer.getUser().getId());
        dto.setTopic(offer.getTopic());
        dto.setDescription(offer.getDescription());
        return dto;
    }

    /**
     * Converts an offer to an OfferRequestDTO.
     *
     * @param offer The offer to convert.
     * @return The converted OfferRequestDTO.
     */
    public OfferRequestDTO convertToRequestDTO(@NotNull Offer offer) {
        UserResponseDTO user = userService.getUserById(offer.getUser().getId());
        return new OfferRequestDTO(
                    offer.getId(),
                    user.getId(),
                user.getFirstName()+" "+user.getLastName(),
                    offer.getTopic(),
                    offer.getDescription(),
                    offer.getResponse(),
                    offer.getStatus().toString(),
                    offer.getCreatedAt(),
                    offer.getUpdatedAt()
        );
    }

    /**
     * Gets the total number of offers.
     *
     * @return The total number of offers.
     */
    @Transactional(readOnly = true)
    public long getOffersCount() {return offerRepository.count();}

    /**
     * Gets the number of pending offers.
     *
     * @return The number of pending offers.
     */
    @Transactional(readOnly = true)
    public long getPendingOffersCount() {return offerRepository.countByStatus(OfferStatus.PENDING);}

    /**
     * Updates the admin response for an offer.
     *
     * @param updateDto The DTO containing the updated information.
     * @return The updated offer.
     * @throws IllegalArgumentException if the offer is not found or the status transition is invalid.
     * @throws ServiceException if there is an error while updating the offer.
     */
    @Transactional
    public Offer updateAdminResponse(OfferResponseDto updateDto) {
        try {
            

            Offer offer = offerRepository.findById(updateDto.getOfferId())
                    .orElseThrow(() -> new IllegalArgumentException("Заявка не найдена"));


            if (!offer.getStatus().canTransitionTo(updateDto.getStatus())) {
                throw new IllegalArgumentException(
                        String.format("Невозможно изменить статус с %s на %s",
                                offer.getStatus(), updateDto.getStatus())
                );
            }

            // Обновляем статус и ответ
            offer.setStatus(updateDto.getStatus());
            offer.setResponse(updateDto.getResponse());
            offer.setUpdatedAt(LocalDateTime.now());

            return offerRepository.save(offer);

        } catch (Exception e) {
            
            throw new ServiceException(String.format("Ошибка при обновлении заявки: %s", e.getMessage()));
        }
    }

    /**
     * Gets a paginated list of all offers.
     *
     * @param page The page number.
     * @param size The page size.
     * @return A paginated list of all offers.
     */
    public Page<OfferRequestDTO> getAllOfferJson(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Offer> offers = offerRepository.findAll(pageable);
        return offers.map(this::convertToRequestDTO);
    }

    /**
     * Gets a paginated list of all offers sorted by status.
     *
     * @param page The page number.
     * @param size The page size.
     * @param status The status to sort by.
     * @return A paginated list of all offers sorted by status.
     */
    public Page<OfferRequestDTO> getAllOfferJsonSortByStatus(Integer page, Integer size, OfferStatus status) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Offer> offers = offerRepository.findByStatus(status, pageable);
        return offers.map(this::convertToRequestDTO);
    }
}