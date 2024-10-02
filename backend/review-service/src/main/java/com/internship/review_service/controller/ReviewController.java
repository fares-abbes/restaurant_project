package com.internship.review_service.controller;

import com.internship.review_service.dto.ReviewRequest;
import com.internship.review_service.dto.ReviewResponse;
import com.internship.review_service.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void addReview(@RequestBody ReviewRequest reviewRequest) {
        reviewService.addReview(reviewRequest);
    }

    @GetMapping("/{menuItemId}")
    @ResponseStatus(HttpStatus.OK)
    public List<ReviewResponse> getReviewsByMenuItemId(@PathVariable Long menuItemId) {
        return reviewService.getReviewsByMenuItemId(menuItemId);
    }

    @GetMapping("/today")
    @ResponseStatus(HttpStatus.OK)
    public List<ReviewResponse> getReviewsForToday() {
        return reviewService.getReviewsForToday();
    }
    @GetMapping("/average-rating/{menuItemId}")
    @ResponseStatus(HttpStatus.OK)
    public BigDecimal getAverageRating(@PathVariable Long menuItemId) {
        return reviewService.getAverageRating(menuItemId);
    }
}

