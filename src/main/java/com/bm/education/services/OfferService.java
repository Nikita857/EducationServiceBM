package com.bm.education.services;

import com.bm.education.dto.OfferDto;
import com.bm.education.dto.OfferResponseDto;
import com.bm.education.models.Offer;
import com.bm.education.models.OfferStatus;
import com.bm.education.repositories.OfferRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.service.spi.ServiceException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;

    @Transactional
    public Offer saveOffer(Offer offer) {
        try {
            log.debug("Saving offer: topic={}, user={}", offer.getTopic(), offer.getUser().getId());

            // Убедимся, что установлены значения по умолчанию
            if (offer.getStatus() == null) {
                offer.setStatus(OfferStatus.PENDING);
            }
            if (offer.getCreatedAt() == null) {
                offer.setCreatedAt(LocalDateTime.now());
            }
            offer.setUpdatedAt(LocalDateTime.now());

            Offer savedOffer = offerRepository.save(offer);
            log.debug("Offer saved successfully with id: {}", savedOffer.getId());
            return savedOffer;

        } catch (ConstraintViolationException e) {
            log.error("Constraint violation: {}", e.getConstraintViolations());
            throw new ValidationException("Ошибка валидации: " +
                    e.getConstraintViolations().stream()
                            .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                            .collect(Collectors.joining(", ")));
        } catch (Exception e) {
            log.error("Error saving offer: {}", e.getMessage(), e);
            throw new ServiceException("Ошибка при сохранении предложения");
        }
    }
    public List<Offer> getUserOffers(Integer userId) {
        return offerRepository.findByUserId(userId);
    }

    public List<Offer> getOffersWithStatus(String status) {
        return offerRepository.findByStatus(status).isEmpty()? null : offerRepository.findByStatus(status);
    }
    public OfferDto getOfferById(Integer id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Offer not found with id: " + id));

        return convertToDto(offer);
    }

    public OfferDto convertToDto(Offer offer) {
        OfferDto dto = new OfferDto();
        dto.setUserId(offer.getUser().getId());
        dto.setTopic(offer.getTopic());
        dto.setDescription(offer.getDescription());
        return dto;
    }

    public List<Offer> getAllOffers() {return offerRepository.findAll();}
    public Offer getSelectedOffer(Integer id) {return offerRepository.findById(id).orElse(null);}

    @Transactional
    public Offer updateAdminResponse(OfferResponseDto updateDto) {
        try {
            log.debug("Updating admin response for offer: {}", updateDto.getOfferId());

            Offer offer = offerRepository.findById(updateDto.getOfferId())
                    .orElseThrow(() -> new IllegalArgumentException("Заявка не найдена"));

            // Обновляем статус и ответ
            offer.setStatus(updateDto.getStatus());
            offer.setResponse(updateDto.getResponse());
            offer.setUpdatedAt(LocalDateTime.now());

            Offer updatedOffer = offerRepository.save(offer);
            log.info("Offer {} updated with status: {}", updatedOffer.getId(), updatedOffer.getStatus());

            return updatedOffer;

        } catch (Exception e) {
            log.error("Error updating admin response: {}", e.getMessage(), e);
            throw new ServiceException("Ошибка при обновлении заявки: " + e.getMessage());
        }
    }
}
