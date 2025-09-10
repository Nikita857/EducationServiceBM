package com.bm.education.repositories;

import com.bm.education.models.Offer;
import com.bm.education.models.OfferStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OfferRepository extends JpaRepository<Offer, Integer> {
    List<Offer> findByUserId(Integer userId);
    @Query(value = "SELECT o.id, o.topic, o.description, o.created_at, o.user_id," +
            " o.status, o.updated_at, o.response, u.first_name, u.last_name, u.department" +
            " FROM offers o JOIN users u ON o.user_id = u.id WHERE o.status = :status;", nativeQuery = true)
    List<Offer> findByStatus(@Param("status") String status);
    List<Offer> findAll();
    Optional<Offer> findById(Integer id);

    @Query("SELECT o FROM Offer o LEFT JOIN FETCH o.user WHERE o.id = :id")
    Optional<Offer> findByIdWithUser(@Param("id") Integer id);

    Page<Offer> findByStatus(OfferStatus status, Pageable pageable);
    long count();
    long countByStatus(OfferStatus status);

    @Modifying
    void deleteByUser_Id(Integer userId);
}