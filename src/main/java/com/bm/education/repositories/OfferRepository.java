package com.bm.education.repositories;

import com.bm.education.models.Offer;
import com.bm.education.models.OfferStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OfferRepository extends JpaRepository<Offer, Integer> {
    List<Offer> findByUserId(Integer userId);
    @Query(value = "SELECT \n" +
            "    o.id,\n" +
            "    o.topic,\n" +
            "    o.description,\n" +
            "    o.created_at,\n" +
            "    o.user_id,\n" +
            "    o.status,\n" +
            "    o.updated_at,\n" +
            "    o.response,\n" +
            "    u.first_name,\n" +
            "    u.last_name,\n" +
            "    u.department\n" +
            "FROM offers o\n" +
            "JOIN users u ON o.user_id = u.id\n" +
            "WHERE o.status = :status;", nativeQuery = true)
    List<Offer> findByStatus(@Param("status") String status);
    List<Offer> findAll();
    Optional<Offer> findById(Integer id);

    @Query("SELECT o FROM Offer o LEFT JOIN FETCH o.user WHERE o.id = :id")
    Optional<Offer> findByIdWithUser(@Param("id") Integer id);

    Page<Offer> findByStatus(OfferStatus status, Pageable pageable);
}
