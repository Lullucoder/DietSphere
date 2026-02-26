package com.nutrition.dietbalancetracker.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.nutrition.dietbalancetracker.dto.NutrientAnalysisDTO;
import com.nutrition.dietbalancetracker.dto.NutrientAnalysisDTO.NutrientDetail;
import com.nutrition.dietbalancetracker.dto.NutrientAnalysisDTO.Recommendation;
import com.nutrition.dietbalancetracker.model.DietaryEntry;
import com.nutrition.dietbalancetracker.model.NutrientProfile;
import com.nutrition.dietbalancetracker.model.User;
import com.nutrition.dietbalancetracker.repository.DietaryEntryRepository;
import com.nutrition.dietbalancetracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * NUTRIENT ANALYSIS SERVICE
 * ==========================
 * Analyzes a user's dietary entries for a time period and calculates
 * nutrient intake vs. recommended daily values. Detects deficiencies
 * and generates personalized food recommendations.
 */
@Service
@RequiredArgsConstructor
public class NutrientAnalysisService {

    private final DietaryEntryRepository dietaryEntryRepository;
    private final UserRepository userRepository;

    /**
     * Analyze nutrition for today's meals.
     */
    public NutrientAnalysisDTO analyzeToday(Long userId) {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);

        List<DietaryEntry> entries = dietaryEntryRepository
                .findByUserIdAndConsumedAtBetweenOrderByConsumedAtDesc(userId, startOfDay, endOfDay);

        User user = userRepository.findById(userId).orElse(null);
        return buildAnalysis(entries, 1, user);
    }

    /**
     * Analyze nutrition for the past 7 days (averaged per day).
     */
    public NutrientAnalysisDTO analyzeWeek(Long userId) {
        LocalDateTime startOfWeek = LocalDateTime.now().minusDays(7).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime now = LocalDateTime.now();

        List<DietaryEntry> entries = dietaryEntryRepository
                .findByUserIdAndConsumedAtBetweenOrderByConsumedAtDesc(userId, startOfWeek, now);

        // Count distinct days with entries
        Set<String> activeDays = new HashSet<>();
        for (DietaryEntry e : entries) {
            activeDays.add(e.getConsumedAt().toLocalDate().toString());
        }
        int days = Math.max(activeDays.size(), 1);

        User user = userRepository.findById(userId).orElse(null);
        return buildAnalysis(entries, days, user);
    }

    /**
     * Core analysis logic: aggregate nutrients from entries,
     * compare against recommended daily values, generate recommendations.
     */
    private NutrientAnalysisDTO buildAnalysis(List<DietaryEntry> entries, int days, User user) {
        NutrientAnalysisDTO dto = new NutrientAnalysisDTO();
        dto.setMealCount(entries.size());

        // Accumulated nutrient totals
        double calories = 0, protein = 0, carbs = 0, fat = 0, fiber = 0;
        double vitA = 0, vitC = 0, vitD = 0, vitE = 0, vitK = 0, vitB12 = 0;
        double calcium = 0, iron = 0, magnesium = 0, zinc = 0, potassium = 0;

        for (DietaryEntry entry : entries) {
            NutrientProfile np = entry.getFoodItem() != null ? entry.getFoodItem().getNutrientProfile() : null;
            if (np == null) continue;
            double p = entry.getPortionSize() != null ? entry.getPortionSize() : 1.0;

            calories += np.getCalories() * p;
            protein += np.getProtein() * p;
            carbs += np.getCarbohydrates() * p;
            fat += np.getFat() * p;
            fiber += np.getFiber() * p;
            vitA += np.getVitaminA() * p;
            vitC += np.getVitaminC() * p;
            vitD += np.getVitaminD() * p;
            vitE += np.getVitaminE() * p;
            vitK += np.getVitaminK() * p;
            vitB12 += np.getVitaminB12() * p;
            calcium += np.getCalcium() * p;
            iron += np.getIron() * p;
            magnesium += np.getMagnesium() * p;
            zinc += np.getZinc() * p;
            potassium += np.getPotassium() * p;
        }

        // Average per day when looking at a multi-day period
        double d = days;
        dto.setTotalCalories(calories / d);

        // ── BMI-adjusted Recommended Daily Values ──
        // Base values (adult approximate)
        double recProtein = 50, recCarbs = 275, recFat = 78, recFiber = 28;
        double recVitA = 900, recVitC = 90, recVitD = 20, recVitE = 15, recVitK = 120, recVitB12 = 2.4;
        double recCalcium = 1000, recIron = 18, recMagnesium = 400, recZinc = 11, recPotassium = 2600;

        // Adjust RDAs based on user's BMI profile
        if (user != null && user.getBmi() != null) {
            Double bmi = user.getBmi();
            if (bmi < 18.5) {
                // Underweight: boost calories & protein to encourage healthy weight gain
                recProtein *= 1.3;   // +30% protein
                recCarbs *= 1.2;     // +20% carbs
                recFat *= 1.1;       // +10% fat
                recCalcium *= 1.15;  // bone support
                recIron *= 1.1;
            } else if (bmi >= 25 && bmi < 30) {
                // Overweight: moderate reduction in calorie-dense macros
                recCarbs *= 0.85;    // -15% carbs
                recFat *= 0.85;      // -15% fat
                recProtein *= 1.1;   // slightly more protein for satiety
                recFiber *= 1.15;    // +15% fiber for fullness
            } else if (bmi >= 30) {
                // Obese: more significant reduction, higher protein & fiber
                recCarbs *= 0.75;    // -25% carbs
                recFat *= 0.75;      // -25% fat
                recProtein *= 1.2;   // +20% protein for satiety & muscle preservation
                recFiber *= 1.25;    // +25% fiber
                recVitD *= 1.3;      // obese individuals often low in Vit D
            }
            // Normal weight (18.5-25): keep defaults
        }

        // Macronutrients
        List<NutrientDetail> macros = new ArrayList<>();
        macros.add(new NutrientDetail("Protein", protein / d, recProtein, "g"));
        macros.add(new NutrientDetail("Carbohydrates", carbs / d, recCarbs, "g"));
        macros.add(new NutrientDetail("Fat", fat / d, recFat, "g"));
        macros.add(new NutrientDetail("Fiber", fiber / d, recFiber, "g"));
        dto.setMacronutrients(macros);

        // Micronutrients
        List<NutrientDetail> micros = new ArrayList<>();
        micros.add(new NutrientDetail("Vitamin A", vitA / d, recVitA, "mcg"));
        micros.add(new NutrientDetail("Vitamin C", vitC / d, recVitC, "mg"));
        micros.add(new NutrientDetail("Vitamin D", vitD / d, recVitD, "mcg"));
        micros.add(new NutrientDetail("Vitamin E", vitE / d, recVitE, "mg"));
        micros.add(new NutrientDetail("Vitamin K", vitK / d, recVitK, "mcg"));
        micros.add(new NutrientDetail("Vitamin B12", vitB12 / d, recVitB12, "mcg"));
        micros.add(new NutrientDetail("Calcium", calcium / d, recCalcium, "mg"));
        micros.add(new NutrientDetail("Iron", iron / d, recIron, "mg"));
        micros.add(new NutrientDetail("Magnesium", magnesium / d, recMagnesium, "mg"));
        micros.add(new NutrientDetail("Zinc", zinc / d, recZinc, "mg"));
        micros.add(new NutrientDetail("Potassium", potassium / d, recPotassium, "mg"));
        dto.setMicronutrients(micros);

        // Overall score = average percentage of all nutrients
        List<NutrientDetail> all = new ArrayList<>();
        all.addAll(macros);
        all.addAll(micros);
        double avgScore = all.stream().mapToDouble(NutrientDetail::getPercentage).average().orElse(0);
        dto.setOverallScore(Math.min(avgScore, 100));

        // Generate recommendations for deficient nutrients
        List<Recommendation> recs = new ArrayList<>();
        addRecommendationIfLow(recs, "Protein", protein / d, recProtein,
                Arrays.asList("Chicken Breast", "Eggs", "Salmon", "Almonds"));
        addRecommendationIfLow(recs, "Fiber", fiber / d, recFiber,
                Arrays.asList("Broccoli", "Brown Rice", "Apple", "Spinach"));
        addRecommendationIfLow(recs, "Vitamin C", vitC / d, recVitC,
                Arrays.asList("Broccoli", "Spinach", "Banana"));
        addRecommendationIfLow(recs, "Vitamin D", vitD / d, recVitD,
                Arrays.asList("Salmon", "Egg", "Milk"));
        addRecommendationIfLow(recs, "Calcium", calcium / d, recCalcium,
                Arrays.asList("Milk", "Broccoli", "Almonds"));
        addRecommendationIfLow(recs, "Iron", iron / d, recIron,
                Arrays.asList("Spinach", "Chicken Breast", "Brown Rice"));
        addRecommendationIfLow(recs, "Potassium", potassium / d, recPotassium,
                Arrays.asList("Banana", "Spinach", "Milk"));
        addRecommendationIfLow(recs, "Vitamin B12", vitB12 / d, recVitB12,
                Arrays.asList("Salmon", "Egg", "Milk"));
        dto.setRecommendations(recs);

        return dto;
    }

    private void addRecommendationIfLow(List<Recommendation> recs,
                                         String nutrient, double consumed, double recommended,
                                         List<String> foodSuggestions) {
        double pct = recommended > 0 ? (consumed / recommended) * 100 : 100;
        if (pct < 50) {
            recs.add(new Recommendation(nutrient,
                    String.format("Your %s intake is very low (%.0f%% of daily goal). Consider adding more %s-rich foods.",
                            nutrient, pct, nutrient.toLowerCase()),
                    "HIGH", foodSuggestions));
        } else if (pct < 80) {
            recs.add(new Recommendation(nutrient,
                    String.format("Your %s intake is below target (%.0f%%). Try adding a serving of recommended foods.",
                            nutrient, pct),
                    "MEDIUM", foodSuggestions));
        }
    }
}
