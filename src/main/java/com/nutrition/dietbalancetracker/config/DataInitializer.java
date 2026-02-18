package com.nutrition.dietbalancetracker.config;

import com.nutrition.dietbalancetracker.model.*;
import com.nutrition.dietbalancetracker.repository.FoodItemRepository;
import com.nutrition.dietbalancetracker.repository.NutrientProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

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
        // Apple
        createFood("Apple", "Fresh medium apple", FoodCategory.FRUIT,
                95, 0.5, 25, 0.3, 4.4);
        
        // Banana
        createFood("Banana", "Medium banana", FoodCategory.FRUIT,
                105, 1.3, 27, 0.4, 3.1);
        
        // Chicken Breast
        createFood("Chicken Breast", "Grilled skinless chicken breast (100g)", FoodCategory.PROTEIN,
                165, 31, 0, 3.6, 0);
        
        // Brown Rice
        createFood("Brown Rice", "Cooked brown rice (1 cup)", FoodCategory.GRAIN,
                216, 5, 45, 1.8, 3.5);
        
        // Broccoli
        createFood("Broccoli", "Steamed broccoli (1 cup)", FoodCategory.VEGETABLE,
                55, 3.7, 11, 0.6, 5.1);
        
        // Milk
        createFood("Milk", "Whole milk (1 cup)", FoodCategory.DAIRY,
                149, 7.7, 11.7, 7.9, 0);
        
        // Egg
        createFood("Egg", "Large boiled egg", FoodCategory.PROTEIN,
                78, 6.3, 0.6, 5.3, 0);
        
        // Salmon
        createFood("Salmon", "Grilled salmon fillet (100g)", FoodCategory.PROTEIN,
                206, 22, 0, 13, 0);
        
        // Spinach
        createFood("Spinach", "Raw spinach (1 cup)", FoodCategory.VEGETABLE,
                7, 0.9, 1.1, 0.1, 0.7);
        
        // Almonds
        createFood("Almonds", "Raw almonds (28g)", FoodCategory.NUT_SEED,
                164, 6, 6, 14, 3.5);
    }
    
    private void createFood(String name, String description, FoodCategory category,
                           double calories, double protein, double carbs, double fat, double fiber) {
        // Create food item
        FoodItem food = new FoodItem();
        food.setName(name);
        food.setDescription(description);
        food.setCategory(category);
        food.setIsActive(true);
        food.setIsCustom(false);
        food.setVersion(1);
        food = foodItemRepository.save(food);
        
        // Create nutrient profile
        NutrientProfile profile = new NutrientProfile();
        profile.setFoodItem(food);
        profile.setServingSize(100.0);
        profile.setCalories(calories);
        profile.setProtein(protein);
        profile.setCarbohydrates(carbs);
        profile.setFat(fat);
        profile.setFiber(fiber);
        
        // Set default values for other nutrients
        profile.setVitaminA(0.0);
        profile.setVitaminC(0.0);
        profile.setVitaminD(0.0);
        profile.setVitaminE(0.0);
        profile.setVitaminK(0.0);
        profile.setVitaminB12(0.0);
        profile.setCalcium(0.0);
        profile.setIron(0.0);
        profile.setMagnesium(0.0);
        profile.setZinc(0.0);
        profile.setPotassium(0.0);
        
        nutrientProfileRepository.save(profile);
    }
}
