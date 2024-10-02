package com.internship.menu_service.dto;

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
    private Long id; // Use Long for IDs when working with JPA
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private String categoryId; // Assuming you use an ID to refer to categories
}
