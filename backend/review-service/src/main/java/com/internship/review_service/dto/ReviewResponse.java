package com.internship.review_service.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long menuItemId;
    private String userName;
    private String comment;
    private BigDecimal rating; // Rating out of 5
    private LocalDateTime reviewDate;
}