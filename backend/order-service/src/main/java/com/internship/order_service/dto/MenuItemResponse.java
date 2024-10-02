package com.internship.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MenuItemResponse {
    private Long id; // The ID of the menu item
    private String name; // The name of the menu item
    private String description; // Description of the menu item
    private BigDecimal price; // The price of the menu item
    private String imageUrl; // URL of the image associated with the menu item
    private String categoryId; // Category ID associated with the menu item
}
