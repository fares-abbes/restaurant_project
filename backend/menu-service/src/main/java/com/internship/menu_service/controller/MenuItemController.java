package com.internship.menu_service.controller;

import com.internship.menu_service.dto.MenuItemRequest;
import com.internship.menu_service.dto.MenuItemResponse;
import com.internship.menu_service.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
@RequiredArgsConstructor
public class MenuItemController {


    private final MenuItemService menuItemService;



    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createMenuItem(@RequestBody MenuItemRequest menuItemRequest) {
        menuItemService.createMenuItem(menuItemRequest);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<MenuItemResponse> getAllMenuItems() {
        return menuItemService.getAllMenuItems();
    }
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public MenuItemResponse getMenuItemById(@PathVariable Long id) {
        return menuItemService.getMenuItemById(id);
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMenuItem(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
    }
}
