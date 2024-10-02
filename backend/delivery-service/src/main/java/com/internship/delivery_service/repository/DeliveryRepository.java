package com.internship.delivery_service.repository;

import com.internship.delivery_service.model.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    // Additional query methods can be defined here if needed
}
