package com.internship.admin_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemSalesResponse {
    private Long menuItemId;
    private String menuItemName;
    private int quantitySold;
}
