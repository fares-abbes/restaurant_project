package com.internship.admin_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long menuItemId;
    private String userName;
    private String comment;
    private BigDecimal rating; // Rating out of 5
    private LocalDateTime reviewDate;
}
