package com.nutrition.dietbalancetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * CHART DATA DTO
 * ==============
 * Aggregate data specifically shaped for the frontend charts page.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChartDataDTO {

    /** Daily calorie + macro totals for each day in the requested range */
    private List<DayData> dailyTrend;

    /** Macro distribution (protein, carbs, fat) as grams and percentages */
    private MacroSplit macroSplit;

    /** Calorie breakdown by meal type (breakfast, lunch, dinner, snack) */
    private List<MealTypeBreakdown> mealTypeBreakdown;

    /** Top 10 most-logged foods with total calories contributed */
    private List<TopFood> topFoods;

    /** Micronutrient radar: percentage of RDA for key vitamins/minerals */
    private List<RadarPoint> nutrientRadar;

    /* ---- inner classes ---- */

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class DayData {
        private String date;    // yyyy-MM-dd
        private String label;   // "Mon", "Tue", etc.
        private double calories;
        private double protein;
        private double carbs;
        private double fat;
        private int mealCount;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class MacroSplit {
        private double proteinGrams;
        private double carbsGrams;
        private double fatGrams;
        private double proteinPct;
        private double carbsPct;
        private double fatPct;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class MealTypeBreakdown {
        private String mealType;
        private double calories;
        private int count;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class TopFood {
        private String name;
        private double totalCalories;
        private int timesLogged;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class RadarPoint {
        private String nutrient;
        private double percentage; // 0..100+ (% of RDA)
    }
}
