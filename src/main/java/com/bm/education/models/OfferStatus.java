package com.bm.education.models;

import java.util.Map;
import java.util.Set;

public enum OfferStatus {
    PENDING,    // На рассмотрении
    APPROVED,   // Одобрено
    REJECTED,// Отклонено
    COMPLETED; //Заявка выполнена

    private static final Map<OfferStatus, Set<OfferStatus>> FORBIDDEN_TRANSITIONS = Map.of(
            COMPLETED, Set.of(PENDING, APPROVED, REJECTED),
            REJECTED, Set.of(PENDING, APPROVED, COMPLETED),
            APPROVED, Set.of(PENDING),
            PENDING, Set.of(COMPLETED)
    );

    public boolean canTransitionTo(OfferStatus newStatus) {
        return !FORBIDDEN_TRANSITIONS.getOrDefault(this, Set.of()).contains(newStatus);
    }

}