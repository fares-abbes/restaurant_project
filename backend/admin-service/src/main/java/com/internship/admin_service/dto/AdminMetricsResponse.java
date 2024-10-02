package com.internship.admin_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminMetricsResponse {
    private LocalDate date;
    private BigDecimal totalIncome;
    private Long totalOrders;
    private Map<Integer, Long> ratingPercentages;
    private List<MenuItemSalesResponse> menuItemsRankedBySales;
}
