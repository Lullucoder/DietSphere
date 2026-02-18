package com.nutrition.dietbalancetracker.dto;

import com.nutrition.dietbalancetracker.model.FoodCategory;
import lombok.Data;

/**
 * FOOD ITEM RESPONSE DTO
 * ======================
 * What we send to frontend when showing food items.
 */
@Data
public class FoodItemResponseDTO {
    private Long id;
    private String name;
    private String description;
    private FoodCategory category;
    private Double calories;
    private Double protein;
    private Double carbohydrates;
    private Double fat;
}
