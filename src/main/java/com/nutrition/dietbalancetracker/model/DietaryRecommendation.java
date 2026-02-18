package com.nutrition.dietbalancetracker.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DIETARY RECOMMENDATION ENTITY
 * ==============================
 * Stores personalized food recommendations for users.
 */
@Entity
@Table(name = "dietary_recommendations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DietaryRecommendation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Who is this recommendation for?
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // What food are we recommending?
    @ManyToOne
    @JoinColumn(name = "food_item_id", nullable = false)
    private FoodItem recommendedFood;
    
    // Which nutrient does this help with?
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Nutrient targetNutrient;
    
    // How much should they eat?
    @Column(nullable = false)
    private Double suggestedPortionSize;
    
    // How relevant is this recommendation? (0-100)
    @Column(nullable = false)
    private Double relevanceScore;
    
    // Why are we recommending this?
    @Column(nullable = false, length = 500)
    private String rationale;
    
    // Has the user seen this?
    @Column(nullable = false)
    private Boolean isAcknowledged = false;
    
    // When was this created?
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    // When does this recommendation expire?
    @Column(nullable = false)
    private LocalDate validUntil;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
