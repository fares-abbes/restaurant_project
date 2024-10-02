package com.internship.admin_service.controller;

import com.internship.admin_service.dto.MenuItemRequest;
import com.internship.admin_service.dto.AdminMetricsResponse;
import com.internship.admin_service.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // Endpoint to generate metrics for today
    @GetMapping("/metrics/today")
    public ResponseEntity<AdminMetricsResponse> getMetricsForToday() {
        AdminMetricsResponse metrics = adminService.generateMetricsForToday();
        return ResponseEntity.ok(metrics);
    }

    // Endpoint to create a menu item
    @PostMapping("/menu-items")
    public ResponseEntity<Void> createMenuItem(@RequestBody MenuItemRequest menuItemRequest) {
        adminService.createMenuItem(menuItemRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // Endpoint to delete a menu item by ID
    @DeleteMapping("/menu-items/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        adminService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
}
