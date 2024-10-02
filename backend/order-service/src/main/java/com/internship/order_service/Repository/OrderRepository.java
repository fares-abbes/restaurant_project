package com.internship.order_service.Repository;
import com.internship.order_service.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}
