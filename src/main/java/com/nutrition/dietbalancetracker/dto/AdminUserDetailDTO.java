package com.nutrition.dietbalancetracker.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ADMIN USER DETAIL DTO
 * ======================
 * Detailed user information for the admin user detail panel.
 * Includes dietary entries and nutrition goals.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDetailDTO {
    private Long id;
    private String username;
    private String email;
    private Integer age;
    private String role;
    private Double weightKg;
    private Double heightCm;
    private Double bmi;
    private String bmiCategory;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long totalDietaryEntries;

    // Nutrition goals
    private Integer calorieGoal;
    private Integer proteinGoal;
    private Integer carbsGoal;
    private Integer fatGoal;
    private Integer fiberGoal;

    // Recent dietary entries
    private List<DietaryEntryDetail> recentEntries;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DietaryEntryDetail {
        private Long id;
        private String foodName;
        private String mealType;
        private Double portionSize;
        private LocalDateTime consumedAt;
    }
}
