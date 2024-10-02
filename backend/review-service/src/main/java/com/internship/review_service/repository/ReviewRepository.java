package com.internship.review_service.repository;

import com.internship.review_service.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMenuItemId(Long menuItemId);

    @Query("SELECT r FROM Review r WHERE r.reviewDate = :date")
    List<Review> findByReviewDate(@Param("date") LocalDateTime date);
}
