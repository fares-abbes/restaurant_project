package com.internship.reservation_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class ReservationRequest {
    private String clientName;
    private LocalDateTime arrivalTime;
    private LocalDateTime departureTime;
    private Integer numberOfPeople;
    private Integer tableNumber;

    // Getters and setters
}
