package com.nutrition.dietbalancetracker.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * NUTRITION GOAL ENTITY
 * =====================
 * Stores the user's personalised daily nutrition targets.
 */
@Entity
@Table(name = "nutrition_goals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NutritionGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer calorieGoal = 2000;

    @Column(nullable = false)
    private Integer proteinGoal = 50;

    @Column(nullable = false)
    private Integer carbsGoal = 300;

    @Column(nullable = false)
    private Integer fatGoal = 65;

    @Column(nullable = false)
    private Integer fiberGoal = 25;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
