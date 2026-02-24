package com.nutrition.dietbalancetracker.dto;

import com.nutrition.dietbalancetracker.model.MealType;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DIETARY ENTRY RESPONSE DTO
 * ===========================
 * Prevents circular JSON serialization (User -> DietaryEntries -> User...).
 */
@Data
public class DietaryEntryResponseDTO {
    private Long id;
    private Long userId;
    private FoodItemResponseDTO foodItem;
    private Double portionSize;
    private LocalDateTime consumedAt;
    private MealType mealType;
    private LocalDateTime createdAt;
}
