package com.nutrition.dietbalancetracker.dto;

import lombok.Data;

/**
 * NUTRITION GOAL DTO
 * ==================
 * Data transfer object for reading / updating nutrition goals.
 */
@Data
public class NutritionGoalDTO {
    private Integer calorieGoal;
    private Integer proteinGoal;
    private Integer carbsGoal;
    private Integer fatGoal;
    private Integer fiberGoal;
}
