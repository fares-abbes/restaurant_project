package com.internship.review_service.service;

import com.internship.review_service.dto.MenuItemResponse;
import com.internship.review_service.dto.ReviewRequest;
import com.internship.review_service.dto.ReviewResponse;
import com.internship.review_service.exception.MenuItemNotFoundException;
import com.internship.review_service.model.Review;
import com.internship.review_service.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final WebClient.Builder webClientBuilder;
    private final ReviewRepository reviewRepository;

    public void addReview(ReviewRequest reviewRequest) {
        WebClient webClient = webClientBuilder.build();

        try {
            // Call the menu service to validate the menu item ID
            MenuItemResponse menuItem = webClient.get()
                    .uri("http://localhost:8084/api/menu-items/{id}", reviewRequest.getMenuItemId())
                    .retrieve()
                    .bodyToMono(MenuItemResponse.class)
                    .block();

            // Create and save the review
            Review review = Review.builder()
                    .menuItemId(reviewRequest.getMenuItemId())
                    .userName(reviewRequest.getUserName())
                    .comment(reviewRequest.getComment())
                    .rating(reviewRequest.getRating())
                    .reviewDate(LocalDateTime.now())
                    .build();

            reviewRepository.save(review);
        } catch (WebClientResponseException.NotFound e) {
            throw new MenuItemNotFoundException("Menu item not found: " + reviewRequest.getMenuItemId());
        }
    }

    public List<ReviewResponse> getReviewsForToday() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);

        // Adjust this query based on exact LocalDateTime if necessary
        // You might need to adjust this if you need to use a specific date and time
        List<Review> reviews = reviewRepository.findByReviewDate(startOfDay);

        return reviews.stream()
                .filter(review -> review.getReviewDate().isAfter(startOfDay) && review.getReviewDate().isBefore(endOfDay))
                .map(this::convertToReviewResponse)
                .collect(Collectors.toList());
    }

    private ReviewResponse convertToReviewResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getMenuItemId(),
                review.getUserName(),
                review.getComment(),
                review.getRating(),
                review.getReviewDate()
        );
    }

    public List<ReviewResponse> getReviewsByMenuItemId(Long menuItemId) {
        List<Review> reviews = reviewRepository.findByMenuItemId(menuItemId);

        return reviews.stream()
                .map(review -> ReviewResponse.builder()
                        .id(review.getId())
                        .userName(review.getUserName())
                        .comment(review.getComment())
                        .rating(review.getRating())
                        .reviewDate(review.getReviewDate())
                        .build())
                .collect(Collectors.toList());
    }
    public BigDecimal getAverageRating(Long menuItemId) {
        List<Review> reviews = reviewRepository.findByMenuItemId(menuItemId);

        if (reviews.isEmpty()) {
            return BigDecimal.ZERO; // No reviews, return 0
        }

        BigDecimal totalRating = reviews.stream()
                .map(Review::getRating)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return totalRating.divide(BigDecimal.valueOf(reviews.size()), 2, BigDecimal.ROUND_HALF_UP);
    }
}
