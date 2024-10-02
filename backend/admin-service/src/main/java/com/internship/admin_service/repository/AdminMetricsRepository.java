package com.internship.admin_service.repository;

import com.internship.admin_service.model.AdminMetrics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface AdminMetricsRepository extends JpaRepository<AdminMetrics, Long> {

    AdminMetrics findByDate(LocalDate date);
}
