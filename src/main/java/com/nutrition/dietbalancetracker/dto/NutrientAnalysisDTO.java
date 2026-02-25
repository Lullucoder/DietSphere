package com.nutrition.dietbalancetracker.dto;

import java.util.List;

import lombok.Data;

/**
 * NUTRIENT ANALYSIS RESPONSE DTO
 * ================================
 * Sent to the frontend on the nutrition analysis page.
 */
@Data
public class NutrientAnalysisDTO {
    private double totalCalories;
    private int mealCount;
    private double overallScore;
    private List<NutrientDetail> macronutrients;
    private List<NutrientDetail> micronutrients;
    private List<Recommendation> recommendations;

    @Data
    public static class NutrientDetail {
        private String name;
        private double consumed;
        private double recommended;
        private double percentage;
        private String unit;

        public NutrientDetail(String name, double consumed, double recommended, String unit) {
            this.name = name;
            this.consumed = consumed;
            this.recommended = recommended;
            this.percentage = recommended > 0 ? (consumed / recommended) * 100 : 0;
            this.unit = unit;
        }
    }

    @Data
    public static class Recommendation {
        private String nutrient;
        private String message;
        private String priority; // HIGH, MEDIUM, LOW
        private List<String> foods;

        public Recommendation(String nutrient, String message, String priority, List<String> foods) {
            this.nutrient = nutrient;
            this.message = message;
            this.priority = priority;
            this.foods = foods;
        }
    }
}
