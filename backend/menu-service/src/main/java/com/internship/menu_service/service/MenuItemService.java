package com.internship.menu_service.service;

import com.internship.menu_service.dto.MenuItemRequest;
import com.internship.menu_service.dto.MenuItemResponse;
import com.internship.menu_service.exception.ResourceNotFoundException;
import com.internship.menu_service.model.MenuItem;
import com.internship.menu_service.Repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MenuItemService {
    private final MenuItemRepository menuItemRepository;

    public void createMenuItem(MenuItemRequest menuItemRequest) {
        MenuItem menuItem = MenuItem.builder()
                .name(menuItemRequest.getName())
                .description(menuItemRequest.getDescription())
                .price(menuItemRequest.getPrice())
                .imageUrl(menuItemRequest.getImageUrl())
                .categoryId(menuItemRequest.getCategoryId())
                .build();

        menuItemRepository.save(menuItem);
        log.info("Menu item {} is saved", menuItem.getId());
    }

    public List<MenuItemResponse> getAllMenuItems() {
        List<MenuItem> menuItems = menuItemRepository.findAll();

        return menuItems.stream().map(this::mapToMenuItemResponse).toList();
    }

    private MenuItemResponse mapToMenuItemResponse(MenuItem menuItem) {
        return MenuItemResponse.builder()
                .id(menuItem.getId())
                .name(menuItem.getName())
                .description(menuItem.getDescription())
                .price(menuItem.getPrice())
                .imageUrl(menuItem.getImageUrl())
                .categoryId(menuItem.getCategoryId())
                .build();
    }
    public MenuItemResponse getMenuItemById(Long id) {
        return menuItemRepository.findById(id)
                .map(this::mapToMenuItemResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id " + id));
    }
    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Menu item not found with id " + id);
        }
        menuItemRepository.deleteById(id);
        log.info("Menu item with id {} is deleted", id);
    }
}
