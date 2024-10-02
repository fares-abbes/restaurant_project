package com.internship.review_service.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ReviewRequest {
    private Long menuItemId;
    private String userName;
    private String comment;
    private BigDecimal rating; // Rating out of 5
}