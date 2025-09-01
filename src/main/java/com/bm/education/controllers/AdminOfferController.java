package com.bm.education.controllers;

import com.bm.education.dto.OfferRequestDTO;
import com.bm.education.models.Offer;
import com.bm.education.models.OfferStatus;
import com.bm.education.repositories.OfferRepository;
import com.bm.education.services.OfferService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@Slf4j
public class AdminOfferController {
    private final OfferService offerService;
    private final OfferRepository offerRepository;

    public AdminOfferController(OfferService offerService, OfferRepository offerRepository) {
        this.offerService = offerService;
        this.offerRepository = offerRepository;
    }

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
            log.error("Error getting offers: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(
                    Map.of("error", "Internal server error")
            );
        }
    }

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
