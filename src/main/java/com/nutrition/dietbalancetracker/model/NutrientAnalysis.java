package com.nutrition.dietbalancetracker.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * NUTRIENT ANALYSIS ENTITY
 * =========================
 * Stores the calculated nutrient totals for a user over a time period.
 * Think of this as a "nutrition report card" for a specific date range.
 */
@Entity
@Table(name = "nutrient_analyses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NutrientAnalysis {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Which user is this analysis for?
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Date range for this analysis
    @Column(nullable = false)
    private LocalDate startDate;
    
    @Column(nullable = false)
    private LocalDate endDate;
    
    // Total nutrients consumed during this period
    @Column(nullable = false)
    private Double totalCalories = 0.0;
    
    @Column(nullable = false)
    private Double totalProtein = 0.0;
    
    @Column(nullable = false)
    private Double totalCarbohydrates = 0.0;
    
    @Column(nullable = false)
    private Double totalFat = 0.0;
    
    @Column(nullable = false)
    private Double totalFiber = 0.0;
    
    @Column(nullable = false)
    private Double totalVitaminA = 0.0;
    
    @Column(nullable = false)
    private Double totalVitaminC = 0.0;
    
    @Column(nullable = false)
    private Double totalVitaminD = 0.0;
    
    @Column(nullable = false)
    private Double totalCalcium = 0.0;
    
    @Column(nullable = false)
    private Double totalIron = 0.0;
    
    // When was this analysis calculated?
    @Column(nullable = false)
    private LocalDateTime calculatedAt;
    
    @PrePersist
    protected void onCreate() {
        this.calculatedAt = LocalDateTime.now();
    }
}
