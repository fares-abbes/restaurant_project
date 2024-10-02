package com.internship.reservation_service.dto;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReservationResponse {
    private Long id;
    private String clientName;
    private LocalDateTime arrivalTime;
    private LocalDateTime departureTime;
    private Integer numberOfPeople;
    private Integer tableNumber;
}
