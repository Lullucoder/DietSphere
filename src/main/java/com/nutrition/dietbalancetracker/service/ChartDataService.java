package com.nutrition.dietbalancetracker.service;

import com.nutrition.dietbalancetracker.dto.ChartDataDTO;
import com.nutrition.dietbalancetracker.dto.ChartDataDTO.*;
import com.nutrition.dietbalancetracker.model.DietaryEntry;
import com.nutrition.dietbalancetracker.model.NutrientProfile;
import com.nutrition.dietbalancetracker.repository.DietaryEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

/**
 * CHART DATA SERVICE
 * ==================
 * Aggregates dietary entries into shapes consumable by Recharts on the frontend.
 */
@Service
@RequiredArgsConstructor
public class ChartDataService {

    private final DietaryEntryRepository entryRepo;

    /* -------- RDA constants (adult average) -------- */
    private static final double RDA_PROTEIN   = 50;
    private static final double RDA_CARBS     = 300;
    private static final double RDA_FAT       = 65;
    private static final double RDA_FIBER     = 25;
    private static final double RDA_VIT_A     = 900;   // mcg
    private static final double RDA_VIT_C     = 90;    // mg
    private static final double RDA_VIT_D     = 20;    // mcg
    private static final double RDA_CALCIUM   = 1000;  // mg
    private static final double RDA_IRON      = 18;    // mg
    private static final double RDA_POTASSIUM = 2600;  // mg
    private static final double RDA_ZINC      = 11;    // mg
    private static final double RDA_MAGNESIUM = 420;   // mg

    /**
     * Build all chart data for the given number of past days.
     *
     * @param userId user
     * @param days   number of days to look back (e.g. 7 or 30)
     */
    public ChartDataDTO getChartData(Long userId, int days) {
        LocalDateTime start = LocalDate.now().minusDays(days - 1).atStartOfDay();
        LocalDateTime end   = LocalDate.now().plusDays(1).atStartOfDay();

        List<DietaryEntry> entries = entryRepo
                .findByUserIdAndConsumedAtBetweenOrderByConsumedAtDesc(userId, start, end);

        ChartDataDTO dto = new ChartDataDTO();
        dto.setDailyTrend(buildDailyTrend(entries, days));
        dto.setMacroSplit(buildMacroSplit(entries));
        dto.setMealTypeBreakdown(buildMealTypeBreakdown(entries));
        dto.setTopFoods(buildTopFoods(entries));
        dto.setNutrientRadar(buildNutrientRadar(entries, days));
        return dto;
    }

    /* ============ 1. Daily Trend ============ */

    private List<DayData> buildDailyTrend(List<DietaryEntry> entries, int days) {
        // Group entries by date
        Map<LocalDate, List<DietaryEntry>> byDate = entries.stream()
                .collect(Collectors.groupingBy(e -> e.getConsumedAt().toLocalDate()));

        List<DayData> trend = new ArrayList<>();
        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            List<DietaryEntry> dayEntries = byDate.getOrDefault(date, List.of());

            double cal = 0, pro = 0, carb = 0, fat = 0;
            for (DietaryEntry e : dayEntries) {
                NutrientProfile np = getProfile(e);
                if (np == null) continue;
                double p = e.getPortionSize();
                cal  += np.getCalories()       * p;
                pro  += np.getProtein()        * p;
                carb += np.getCarbohydrates()  * p;
                fat  += np.getFat()            * p;
            }

            String label = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            trend.add(new DayData(date.toString(), label, round(cal), round(pro), round(carb), round(fat), dayEntries.size()));
        }
        return trend;
    }

    /* ============ 2. Macro Split ============ */

    private MacroSplit buildMacroSplit(List<DietaryEntry> entries) {
        double pro = 0, carb = 0, fat = 0;
        for (DietaryEntry e : entries) {
            NutrientProfile np = getProfile(e);
            if (np == null) continue;
            double p = e.getPortionSize();
            pro  += np.getProtein()       * p;
            carb += np.getCarbohydrates() * p;
            fat  += np.getFat()           * p;
        }
        double total = pro + carb + fat;
        if (total == 0) total = 1; // avoid /0
        return new MacroSplit(
                round(pro), round(carb), round(fat),
                round(pro / total * 100), round(carb / total * 100), round(fat / total * 100));
    }

    /* ============ 3. Meal-Type Breakdown ============ */

    private List<MealTypeBreakdown> buildMealTypeBreakdown(List<DietaryEntry> entries) {
        Map<String, double[]> map = new LinkedHashMap<>(); // [calories, count]
        for (DietaryEntry e : entries) {
            String mt = e.getMealType() != null ? e.getMealType().name() : "OTHER";
            NutrientProfile np = getProfile(e);
            double cal = np != null ? np.getCalories() * e.getPortionSize() : 0;
            map.computeIfAbsent(mt, k -> new double[2]);
            map.get(mt)[0] += cal;
            map.get(mt)[1] += 1;
        }
        return map.entrySet().stream()
                .map(en -> new MealTypeBreakdown(en.getKey(), round(en.getValue()[0]), (int) en.getValue()[1]))
                .collect(Collectors.toList());
    }

    /* ============ 4. Top Foods ============ */

    private List<TopFood> buildTopFoods(List<DietaryEntry> entries) {
        Map<String, double[]> map = new HashMap<>(); // [totalCal, count]
        for (DietaryEntry e : entries) {
            String name = e.getFoodItem() != null ? e.getFoodItem().getName() : "Unknown";
            NutrientProfile np = getProfile(e);
            double cal = np != null ? np.getCalories() * e.getPortionSize() : 0;
            map.computeIfAbsent(name, k -> new double[2]);
            map.get(name)[0] += cal;
            map.get(name)[1] += 1;
        }
        return map.entrySet().stream()
                .sorted((a, b) -> Double.compare(b.getValue()[1], a.getValue()[1]))
                .limit(10)
                .map(en -> new TopFood(en.getKey(), round(en.getValue()[0]), (int) en.getValue()[1]))
                .collect(Collectors.toList());
    }

    /* ============ 5. Nutrient Radar ============ */

    private List<RadarPoint> buildNutrientRadar(List<DietaryEntry> entries, int days) {
        double pro = 0, carb = 0, fat = 0, fiber = 0;
        double vitA = 0, vitC = 0, vitD = 0, calcium = 0, iron = 0, potassium = 0, zinc = 0, magnesium = 0;

        for (DietaryEntry e : entries) {
            NutrientProfile np = getProfile(e);
            if (np == null) continue;
            double p = e.getPortionSize();
            pro       += np.getProtein()       * p;
            carb      += np.getCarbohydrates() * p;
            fat       += np.getFat()           * p;
            fiber     += safe(np.getFiber())   * p;
            vitA      += safe(np.getVitaminA())  * p;
            vitC      += safe(np.getVitaminC())  * p;
            vitD      += safe(np.getVitaminD())  * p;
            calcium   += safe(np.getCalcium())   * p;
            iron      += safe(np.getIron())      * p;
            potassium += safe(np.getPotassium()) * p;
            zinc      += safe(np.getZinc())      * p;
            magnesium += safe(np.getMagnesium()) * p;
        }

        // Average per day
        double d = Math.max(days, 1);
        List<RadarPoint> points = new ArrayList<>();
        points.add(new RadarPoint("Protein",   Math.min(round(pro / d / RDA_PROTEIN * 100), 150)));
        points.add(new RadarPoint("Carbs",     Math.min(round(carb / d / RDA_CARBS * 100), 150)));
        points.add(new RadarPoint("Fat",       Math.min(round(fat / d / RDA_FAT * 100), 150)));
        points.add(new RadarPoint("Fiber",     Math.min(round(fiber / d / RDA_FIBER * 100), 150)));
        points.add(new RadarPoint("Vitamin A", Math.min(round(vitA / d / RDA_VIT_A * 100), 150)));
        points.add(new RadarPoint("Vitamin C", Math.min(round(vitC / d / RDA_VIT_C * 100), 150)));
        points.add(new RadarPoint("Vitamin D", Math.min(round(vitD / d / RDA_VIT_D * 100), 150)));
        points.add(new RadarPoint("Calcium",   Math.min(round(calcium / d / RDA_CALCIUM * 100), 150)));
        points.add(new RadarPoint("Iron",      Math.min(round(iron / d / RDA_IRON * 100), 150)));
        points.add(new RadarPoint("Potassium", Math.min(round(potassium / d / RDA_POTASSIUM * 100), 150)));
        points.add(new RadarPoint("Zinc",      Math.min(round(zinc / d / RDA_ZINC * 100), 150)));
        points.add(new RadarPoint("Magnesium", Math.min(round(magnesium / d / RDA_MAGNESIUM * 100), 150)));
        return points;
    }

    /* -------- helpers -------- */

    private NutrientProfile getProfile(DietaryEntry e) {
        return e.getFoodItem() != null ? e.getFoodItem().getNutrientProfile() : null;
    }

    private double safe(Double v) { return v != null ? v : 0; }

    private double round(double v) { return Math.round(v * 10.0) / 10.0; }
}
