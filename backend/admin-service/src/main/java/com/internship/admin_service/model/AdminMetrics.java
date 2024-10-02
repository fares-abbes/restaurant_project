package com.internship.admin_service.model;
import com.internship.admin_service.model.MenuItemSalesRank;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "admin_metrics")
public class AdminMetrics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "total_income")
    private BigDecimal totalIncome;

    @Column(name = "total_orders")
    private Long totalOrders;

    @ElementCollection
    @CollectionTable(name = "rating_percentages")
    @MapKeyColumn(name = "rating")
    @Column(name = "percentage")
    private Map<Integer, Long> ratingPercentages;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "admin_metrics_id")
    private List<MenuItemSalesRank> menuItemsRankedBySales;
}
