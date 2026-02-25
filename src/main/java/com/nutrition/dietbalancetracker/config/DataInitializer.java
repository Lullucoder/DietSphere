package com.nutrition.dietbalancetracker.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.nutrition.dietbalancetracker.model.FoodCategory;
import com.nutrition.dietbalancetracker.model.FoodItem;
import com.nutrition.dietbalancetracker.model.NutrientProfile;
import com.nutrition.dietbalancetracker.repository.FoodItemRepository;
import com.nutrition.dietbalancetracker.repository.NutrientProfileRepository;

import lombok.RequiredArgsConstructor;

/**
 * DATA INITIALIZER
 * ================
 * Adds sample foods to the database on startup.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final FoodItemRepository foodItemRepository;
    private final NutrientProfileRepository nutrientProfileRepository;
    
    @Override
    public void run(String... args) {
        // Only initialize if database is empty
        if (foodItemRepository.count() == 0) {
            initializeSampleFoods();
        }
    }
    
    private void initializeSampleFoods() {
        // Apple (1 medium ~182g) – real USDA values
        createFood("Apple", "Fresh medium apple", FoodCategory.FRUIT,
                95, 0.5, 25, 0.3, 4.4,
                5, 8.4, 0, 0.3, 4, 0,
                11, 0.2, 9, 0.1, 195);

        // Banana (1 medium ~118g)
        createFood("Banana", "Medium banana", FoodCategory.FRUIT,
                105, 1.3, 27, 0.4, 3.1,
                4, 10.3, 0, 0.1, 0.6, 0,
                6, 0.3, 32, 0.2, 422);

        // Chicken Breast (100g grilled skinless)
        createFood("Chicken Breast", "Grilled skinless chicken breast (100g)", FoodCategory.PROTEIN,
                165, 31, 0, 3.6, 0,
                6, 0, 0.1, 0.3, 0, 0.3,
                11, 0.7, 29, 0.7, 256);

        // Brown Rice (1 cup cooked ~158g)
        createFood("Brown Rice", "Cooked brown rice (1 cup)", FoodCategory.GRAIN,
                216, 5, 45, 1.8, 3.5,
                0, 0, 0, 0.1, 1.2, 0,
                20, 0.8, 86, 1.2, 154);

        // Broccoli (1 cup steamed ~156g)
        createFood("Broccoli", "Steamed broccoli (1 cup)", FoodCategory.VEGETABLE,
                55, 3.7, 11, 0.6, 5.1,
                120, 101, 0, 1.5, 220, 0,
                62, 1.0, 33, 0.7, 457);

        // Milk, whole (1 cup ~244g)
        createFood("Milk", "Whole milk (1 cup)", FoodCategory.DAIRY,
                149, 7.7, 11.7, 7.9, 0,
                68, 0, 3.2, 0.1, 0.5, 1.1,
                276, 0.1, 24, 0.9, 322);

        // Egg (1 large boiled ~50g)
        createFood("Egg", "Large boiled egg", FoodCategory.PROTEIN,
                78, 6.3, 0.6, 5.3, 0,
                75, 0, 1.1, 0.5, 0.3, 0.6,
                25, 0.6, 5, 0.5, 63);

        // Salmon (100g grilled)
        createFood("Salmon", "Grilled salmon fillet (100g)", FoodCategory.PROTEIN,
                206, 22, 0, 13, 0,
                12, 0, 14.4, 3.5, 0.5, 2.8,
                9, 0.3, 27, 0.4, 363);

        // Spinach (1 cup raw ~30g)
        createFood("Spinach", "Raw spinach (1 cup)", FoodCategory.VEGETABLE,
                7, 0.9, 1.1, 0.1, 0.7,
                141, 8.4, 0, 0.6, 145, 0,
                30, 0.8, 24, 0.2, 167);

        // Almonds (28g raw)
        createFood("Almonds", "Raw almonds (28g)", FoodCategory.NUT_SEED,
                164, 6, 6, 14, 3.5,
                0, 0, 0, 7.3, 0, 0,
                76, 1.0, 76, 0.9, 208);
    }

    private void createFood(String name, String description, FoodCategory category,
                           double calories, double protein, double carbs, double fat, double fiber,
                           double vitA, double vitC, double vitD, double vitE, double vitK, double vitB12,
                           double calcium, double iron, double magnesium, double zinc, double potassium) {
        // Create food item
        FoodItem food = new FoodItem();
        food.setName(name);
        food.setDescription(description);
        food.setCategory(category);
        food.setIsActive(true);
        food.setIsCustom(false);
        food.setVersion(1);
        food = foodItemRepository.save(food);

        // Create nutrient profile with real values
        NutrientProfile profile = new NutrientProfile();
        profile.setFoodItem(food);
        profile.setServingSize(100.0);
        profile.setCalories(calories);
        profile.setProtein(protein);
        profile.setCarbohydrates(carbs);
        profile.setFat(fat);
        profile.setFiber(fiber);
        profile.setVitaminA(vitA);
        profile.setVitaminC(vitC);
        profile.setVitaminD(vitD);
        profile.setVitaminE(vitE);
        profile.setVitaminK(vitK);
        profile.setVitaminB12(vitB12);
        profile.setCalcium(calcium);
        profile.setIron(iron);
        profile.setMagnesium(magnesium);
        profile.setZinc(zinc);
        profile.setPotassium(potassium);

        nutrientProfileRepository.save(profile);
    }
}
