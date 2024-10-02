package com.internship.order_service.service;

import com.internship.order_service.Repository.OrderRepository;
import com.internship.order_service.dto.OrderRequest;
import com.internship.order_service.dto.OrderResponse;
import com.internship.order_service.dto.OrderItemResponse;
import com.internship.order_service.dto.MenuItemResponse;
import com.internship.order_service.exception.MenuItemNotFoundException;
import com.internship.order_service.exception.OrderNotFoundException;
import com.internship.order_service.model.Order;
import com.internship.order_service.model.OrderItem;
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
public class OrderService {

        private final WebClient.Builder webClientBuilder;
        private final OrderRepository orderRepository;

        public OrderResponse createOrder(OrderRequest orderRequest) {
                WebClient webClient = webClientBuilder.build();

                List<OrderItemResponse> orderItems = orderRequest.getItems().stream().map(orderItemRequest -> {
                        try {
                                // Call the menu service to get the menu item by ID
                                MenuItemResponse menuItem = webClient.get()
                                                .uri("http://localhost:8084/api/menu-items/{id}",
                                                                orderItemRequest.getMenuItemId())
                                                .retrieve()
                                                .bodyToMono(MenuItemResponse.class)
                                                .block();

                                // Calculate the total price for the item (price * quantity)
                                BigDecimal itemTotalPrice = menuItem.getPrice()
                                                .multiply(BigDecimal.valueOf(orderItemRequest.getQuantity()));

                                // Return the OrderItemResponse containing the name, price, and quantity
                                return OrderItemResponse.builder()
                                                .name(menuItem.getName())
                                                .quantity(orderItemRequest.getQuantity())
                                                .price(menuItem.getPrice())
                                                .build();
                        } catch (WebClientResponseException.NotFound e) {
                                // If the menu item is not found, throw a custom exception
                                throw new MenuItemNotFoundException(
                                                "Menu item not found: " + orderItemRequest.getMenuItemId());
                        }
                }).collect(Collectors.toList());

                // Calculate the total price for the entire order
                BigDecimal totalOrderPrice = orderItems.stream()
                                .map(orderItemResponse -> orderItemResponse.getPrice()
                                                .multiply(BigDecimal.valueOf(orderItemResponse.getQuantity())))
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Create the Order entity without manually setting the ID
                Order order = Order.builder()
                                .items(orderItems.stream().map(this::mapToOrderItem).collect(Collectors.toList()))
                                .orderDate(LocalDateTime.now())
                                .orderPrice(totalOrderPrice)
                                .build();

                // Save the order to the repository
                Order savedOrder = orderRepository.save(order);

                // Return the OrderResponse containing all items, total price, and the generated
                // ID
                List<OrderItemResponse> savedOrderItems = savedOrder.getItems().stream()
                                .map(item -> OrderItemResponse.builder()
                                                .name(item.getName())
                                                .quantity(item.getQuantity())
                                                .price(item.getPrice())
                                                .build())
                                .collect(Collectors.toList());

                return OrderResponse.builder()
                                .id(savedOrder.getId()) // ID assigned by Hibernate
                                .items(savedOrderItems)
                                .totalPrice(totalOrderPrice)
                                .build();
        }

        private OrderItem mapToOrderItem(OrderItemResponse orderItemResponse) {
                return OrderItem.builder()
                                .name(orderItemResponse.getName())
                                .quantity(orderItemResponse.getQuantity())
                                .price(orderItemResponse.getPrice())
                                .build();
        }

        public void deleteOrder(Long orderId) {
                if (!orderRepository.existsById(orderId)) {
                        throw new OrderNotFoundException("Order with ID " + orderId + " not found.");
                }
                orderRepository.deleteById(orderId);
        }

        // Get order by ID
        public OrderResponse getOrderById(Long id) {
                Order order = orderRepository.findById(id)
                                .orElseThrow(() -> new OrderNotFoundException("Order with ID " + id + " not found."));

                List<OrderItemResponse> orderItems = order.getItems().stream()
                                .map(item -> OrderItemResponse.builder()
                                                .name(item.getName())
                                                .quantity(item.getQuantity())
                                                .price(item.getPrice())
                                                .build())
                                .collect(Collectors.toList());

                return OrderResponse.builder()
                                .id(order.getId())
                                .items(orderItems)
                                .totalPrice(order.getOrderPrice())
                                .build();
        }

        public List<OrderResponse> getAllOrders() {
                return orderRepository.findAll().stream()
                                .map(order -> {
                                        List<OrderItemResponse> orderItems = order.getItems().stream()
                                                        .map(item -> OrderItemResponse.builder()
                                                                        .name(item.getName())
                                                                        .quantity(item.getQuantity())
                                                                        .price(item.getPrice())
                                                                        .build())
                                                        .collect(Collectors.toList());

                                        return OrderResponse.builder()
                                                        .id(order.getId())
                                                        .items(orderItems)
                                                        .totalPrice(order.getOrderPrice())
                                                        .build();
                                })
                                .collect(Collectors.toList());
        }

        public List<OrderResponse> getOrdersForToday() {
                LocalDate today = LocalDate.now();
                List<Order> ordersToday = orderRepository.findByOrderDateBetween(
                                today.atStartOfDay(),
                                today.atTime(23, 59, 59));

                return ordersToday.stream()
                                .map(order -> {
                                        List<OrderItemResponse> orderItems = order.getItems().stream()
                                                        .map(item -> OrderItemResponse.builder()
                                                                        .name(item.getName())
                                                                        .quantity(item.getQuantity())
                                                                        .price(item.getPrice())
                                                                        .build())
                                                        .collect(Collectors.toList());

                                        return OrderResponse.builder()
                                                        .id(order.getId())
                                                        .items(orderItems)
                                                        .totalPrice(order.getOrderPrice())
                                                        .build();
                                })
                                .collect(Collectors.toList());
        }
}
