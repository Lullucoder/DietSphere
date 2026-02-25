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
    private NutrientProfileDTO nutrientProfile;

    /**
     * Nested DTO for full nutrient profile details.
     */
    @Data
    public static class NutrientProfileDTO {
        private Double servingSize;
        private Double calories;
        private Double protein;
        private Double carbohydrates;
        private Double fat;
        private Double fiber;
        private Double vitaminA;
        private Double vitaminC;
        private Double vitaminD;
        private Double vitaminE;
        private Double vitaminK;
        private Double vitaminB12;
        private Double calcium;
        private Double iron;
        private Double magnesium;
        private Double zinc;
        private Double potassium;
    }
}
