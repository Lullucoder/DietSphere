package com.nutrition.dietbalancetracker.dto;

import com.nutrition.dietbalancetracker.model.MealType;
import lombok.Data;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * DIETARY ENTRY DTO
 * =================
 * Data for logging a meal.
 */
@Data
public class DietaryEntryDTO {
    
    @NotNull(message = "Food item ID is required")
    private Long foodItemId;
    
    @NotNull(message = "Portion size is required")
    @DecimalMin(value = "0.1", message = "Portion size must be at least 0.1")
    private Double portionSize;
    
    @NotNull(message = "Meal type is required")
    private MealType mealType;
    
    private LocalDateTime consumedAt; // Optional, defaults to now
}
