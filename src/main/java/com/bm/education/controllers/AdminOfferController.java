package com.bm.education.controllers;

import com.bm.education.dto.OfferRequestDTO;
import com.bm.education.models.Offer;
import com.bm.education.models.OfferStatus;
import com.bm.education.repositories.OfferRepository;
import com.bm.education.services.OfferService;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for handling admin-related offer requests.
 */
@RestController

public class AdminOfferController {
    private final OfferService offerService;
    private final OfferRepository offerRepository;

    /**
     * Constructs a new AdminOfferController object.
     *
     * @param offerService The offer service.
     * @param offerRepository The offer repository.
     */
    public AdminOfferController(OfferService offerService, OfferRepository offerRepository) {
        this.offerService = offerService;
        this.offerRepository = offerRepository;
    }

    /**
     * Gets a paginated list of offers.
     *
     * @param page The page number.
     * @param size The page size.
     * @param status The status to filter by, or "all" to retrieve all offers.
     * @return A response entity containing the paginated list of offers.
     */
    @GetMapping("/admin/offers")
    public ResponseEntity<?> getOffersJson(@RequestParam(defaultValue = "1") int page,
                                           @RequestParam(defaultValue = "10") int size,
                                           @RequestParam(defaultValue = "all") String status) {
        try {
            Map<String, Object> response = new HashMap<>();
            Page<OfferRequestDTO> offerRequestDTOS;

            // Используем Map для маппинга статусов
            Map<String, OfferStatus> statusMap = Map.of(
                    "rejected", OfferStatus.REJECTED,
                    "pending", OfferStatus.PENDING,
                    "completed", OfferStatus.COMPLETED,
                    "approved", OfferStatus.APPROVED
            );

            if (!"all".equalsIgnoreCase(status)) {
                OfferStatus offerStatus = statusMap.get(status.toLowerCase());
                if (offerStatus != null) {
                    offerRequestDTOS = offerService.getAllOfferJsonSortByStatus(page, size, offerStatus);
                } else {
                    // Если статус не найден, возвращаем ошибку
                    return ResponseEntity.badRequest().body(
                            Map.of("error", "Invalid status: " + status)
                    );
                }
            } else {
                offerRequestDTOS = offerService.getAllOfferJson(page, size);
            }

            // Остальной код без изменений...
            response.put("success", true);
            response.put("offers", offerRequestDTOS.getContent());
            response.put("currentPage", offerRequestDTOS.getNumber() + 1);
            response.put("totalPages", offerRequestDTOS.getTotalPages());
            response.put("totalItems", offerRequestDTOS.getTotalElements());
            response.put("pageSize", size);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            
            return ResponseEntity.internalServerError().body(
                    Map.of("error", "Internal server error")
            );
        }
    }

    /**
     * Deletes an offer by its ID.
     *
     * @param id The ID of the offer to delete.
     * @return A response entity indicating that the offer was deleted successfully, or an error if the offer was not found or could not be deleted.
     */
    @PostMapping("/admin/offers/delete/{id}")
    ResponseEntity<?> deleteOffer(@PathVariable("id") int id) {
        try {
            Map<String, Object> response = new HashMap<>();
            Offer offer = offerRepository.findById(id).orElse(null);
            if(offer != null) {
                if(offer.getStatus().equals(OfferStatus.REJECTED) || offer.getStatus().equals(OfferStatus.COMPLETED)) {
                    offerRepository.delete(offer);
                    response.put("success", true);
                    return ResponseEntity.ok().body(response);
                }
                    response.put("success", false);
                    response.put("error", String.format("Заявка со статусом: %s не может быть удалена", offer.getStatus()));
                    return ResponseEntity.badRequest().body(response);
            }
            response.put("success", false);
            response.put("error", "offer is not present");
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
}