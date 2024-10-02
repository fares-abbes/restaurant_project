package com.internship.admin_service.service;

import com.internship.admin_service.dto.*;
import com.internship.admin_service.model.AdminMetrics;
import com.internship.admin_service.model.MenuItemSalesRank;
import com.internship.admin_service.repository.AdminMetricsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final WebClient.Builder webClientBuilder;
    private final AdminMetricsRepository adminMetricsRepository;


    public AdminMetricsResponse generateMetricsForToday() {
        LocalDate today = LocalDate.now();

        BigDecimal totalIncome = calculateTotalIncomeForToday();
        Long totalOrders = calculateTotalOrdersForToday();
        Map<Integer, Long> ratingPercentages = calculateRatingPercentagesForToday();
        List<MenuItemSalesResponse> menuItemsRankedBySales = getMenuItemsRankedBySalesForToday();

        List<MenuItemSalesRank> menuItemSalesRanks = menuItemsRankedBySales.stream()
                .map(response -> {
                    MenuItemSalesRank rank = new MenuItemSalesRank();
                    rank.setMenuItemId(response.getMenuItemId());
                    rank.setQuantitySold(response.getQuantitySold());
                    rank.setMenuItemName(response.getMenuItemName());

                    return rank;
                })
                .collect(Collectors.toList());


        AdminMetrics metrics = new AdminMetrics();
        metrics.setDate(today);
        metrics.setTotalIncome(totalIncome);
        metrics.setTotalOrders(totalOrders);
        metrics.setRatingPercentages(ratingPercentages);
        metrics.setMenuItemsRankedBySales(menuItemSalesRanks);


        AdminMetrics savedMetrics = adminMetricsRepository.save(metrics);


        menuItemSalesRanks.forEach(rank -> rank.setAdminMetrics(savedMetrics));

        return convertToAdminMetricsResponse(savedMetrics);
    }


    private AdminMetricsResponse convertToAdminMetricsResponse(AdminMetrics metrics) {
        List<MenuItemSalesResponse> menuItemsRankedBySales = metrics.getMenuItemsRankedBySales().stream()
                .map(rank -> new MenuItemSalesResponse(
                        rank.getMenuItemId(),
                        rank.getMenuItemName(),
                        rank.getQuantitySold()
                ))
                .collect(Collectors.toList());

        return new AdminMetricsResponse(
                metrics.getDate(),
                metrics.getTotalIncome(),
                metrics.getTotalOrders(),
                metrics.getRatingPercentages(),
                menuItemsRankedBySales
        );
    }

    private BigDecimal calculateTotalIncomeForToday() {
        WebClient webClient = webClientBuilder.build();

        List<OrderResponse> orders = webClient.get()
                .uri("http://localhost:8085/api/orders/today")
                .retrieve()
                .bodyToFlux(OrderResponse.class)
                .collectList()
                .block();

        return orders.stream()
                .map(OrderResponse::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private Long calculateTotalOrdersForToday() {
        WebClient webClient = webClientBuilder.build();

        List<OrderResponse> orders = webClient.get()
                .uri("http://localhost:8085/api/orders/today")
                .retrieve()
                .bodyToFlux(OrderResponse.class)
                .collectList()
                .block();

        return (long) orders.size();
    }

    private Map<Integer, Long> calculateRatingPercentagesForToday() {
        WebClient webClient = webClientBuilder.build();

        List<ReviewResponse> reviews = webClient.get()
                .uri("http://localhost:8086/api/reviews/today")
                .retrieve()
                .bodyToFlux(ReviewResponse.class)
                .collectList()
                .block();

        long totalReviews = reviews.size();

        return reviews.stream()
                .collect(Collectors.groupingBy(
                        review -> review.getRating().intValue(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> (entry.getValue() * 100) / totalReviews
                ));
    }

    private List<MenuItemSalesResponse> getMenuItemsRankedBySalesForToday() {
        WebClient webClient = webClientBuilder.build();

        List<OrderResponse> orders = webClient.get()
                .uri("http://localhost:8085/api/orders/today")
                .retrieve()
                .bodyToFlux(OrderResponse.class)
                .collectList()
                .block();


        Map<String, Integer> salesMap = orders.stream()
                .flatMap(order -> order.getItems().stream())
                .collect(Collectors.toMap(
                        OrderItemResponse::getName,
                        OrderItemResponse::getQuantity,
                        Integer::sum
                ));


        List<MenuItemResponse> menuItems = webClient.get()
                .uri("http://localhost:8084/api/menu-items")
                .retrieve()
                .bodyToFlux(MenuItemResponse.class)
                .collectList()
                .block();


        Map<String, MenuItemResponse> menuItemMap = menuItems.stream()
                .collect(Collectors.toMap(MenuItemResponse::getName, menuItem -> menuItem));

        return salesMap.entrySet().stream()
                .map(entry -> {
                    MenuItemResponse menuItem = menuItemMap.get(entry.getKey());
                    return new MenuItemSalesResponse(
                            menuItem != null ? menuItem.getId() : null, // Get menu item ID
                            menuItem != null ? menuItem.getName() : null, // Get menu item name
                            entry.getValue() // Quantity sold
                    );
                })
                .sorted(Comparator.comparing(MenuItemSalesResponse::getQuantitySold).reversed())
                .collect(Collectors.toList());
    }


    public void createMenuItem(MenuItemRequest menuItemRequest) {
        WebClient webClient = webClientBuilder.build();

        webClient.post()
                .uri("http://localhost:8084/api/menu-items")
                .bodyValue(menuItemRequest)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }

    public void deleteMenuItem(Long menuItemId) {
        WebClient webClient = webClientBuilder.build();

        webClient.delete()
                .uri("http://localhost:8084/api/menu-items/{id}", menuItemId)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }
}
