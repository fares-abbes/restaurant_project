package com.internship.review_service.model;

import lombok.*;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long menuItemId;

    @Column(nullable = false)
    private String userName;

    @Column(nullable = false)
    private String comment;

    @Column(nullable = false)
    private BigDecimal rating; // Consider rating out of 5

    @Column(name = "review_date")
    private LocalDateTime reviewDate;
}
