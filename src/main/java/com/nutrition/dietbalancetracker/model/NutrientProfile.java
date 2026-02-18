package com.nutrition.dietbalancetracker.model;

// Database imports
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * NUTRIENT PROFILE ENTITY
 * ========================
 * This stores the complete nutritional information for a food item.
 * 
 * Think of this as the "Nutrition Facts Label" you see on food packages!
 * 
 * What does it contain?
 * - Serving size (how much is one serving?)
 * - Macronutrients (calories, protein, carbs, fat, fiber)
 * - Vitamins (A, C, D, E, K, B12)
 * - Minerals (calcium, iron, magnesium, zinc, potassium)
 * 
 * All values are "per serving" - so if someone eats 2 servings,
 * we multiply all these numbers by 2!
 * 
 * Relationship: One food item has exactly one nutrient profile.
 */
@Entity
@Table(name = "nutrient_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NutrientProfile {
    
    // ========================================
    // PRIMARY KEY
    // ========================================
    
    /**
     * ID - Unique identifier for this nutrient profile
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // ========================================
    // RELATIONSHIP TO FOOD ITEM
    // ========================================
    
    /**
     * FOOD ITEM - Which food does this nutrition info belong to?
     * 
     * Relationship: One-to-One
     * - Each nutrient profile belongs to exactly one food item
     * - Each food item has exactly one nutrient profile
     * 
     * Think of it like:
     * - FoodItem = The food itself ("Apple")
     * - NutrientProfile = The nutrition label for that food
     * 
     * @JoinColumn creates a "food_item_id" column
     * unique = true ensures one profile per food
     */
    @OneToOne
    @JoinColumn(name = "food_item_id", nullable = false, unique = true)
    private FoodItem foodItem;
    
    // ========================================
    // SERVING SIZE
    // ========================================
    
    /**
     * SERVING SIZE - How much is one serving?
     * 
     * Measured in: Grams (g)
     * 
     * Why is this important?
     * - All other values are "per serving"
     * - Users can eat more or less than one serving
     * - We multiply nutrients by (actual amount / serving size)
     * 
     * Examples:
     * - Apple: 182g (one medium apple)
     * - Chicken breast: 100g (standard portion)
     * - Rice: 158g (one cup cooked)
     * 
     * When a user logs food, they specify portion size:
     * - "I ate 1.5 servings" → multiply all nutrients by 1.5
     * - "I ate 0.5 servings" → multiply all nutrients by 0.5
     */
    @Column(nullable = false)
    private Double servingSize;
    
    // ========================================
    // MACRONUTRIENTS
    // ========================================
    // These are nutrients we need in LARGE amounts
    // They provide energy and are the building blocks of our body
    
    /**
     * CALORIES - Energy content
     * 
     * Measured in: Kilocalories (kcal) - what we call "Calories"
     * 
     * What are calories?
     * - Energy from food
     * - Our body burns calories to function
     * - Too few = tired, weak
     * - Too many = weight gain
     * 
     * Example values (per serving):
     * - Apple: 95 kcal
     * - Chicken breast (100g): 165 kcal
     * - Brown rice (1 cup): 216 kcal
     */
    @Column(nullable = false)
    private Double calories;
    
    /**
     * PROTEIN - Building blocks for muscles and tissues
     * 
     * Measured in: Grams (g)
     * 
     * What does protein do?
     * - Builds and repairs muscles
     * - Makes enzymes and hormones
     * - Supports immune system
     * 
     * Found in: Meat, fish, eggs, dairy, beans, nuts
     * 
     * Example values (per serving):
     * - Apple: 0.5g (very low)
     * - Chicken breast (100g): 31g (very high!)
     * - Egg: 6g
     */
    @Column(nullable = false)
    private Double protein;
    
    /**
     * CARBOHYDRATES - Main energy source
     * 
     * Measured in: Grams (g)
     * 
     * What do carbs do?
     * - Provide quick energy
     * - Fuel for brain and muscles
     * - Include sugars, starches, and fiber
     * 
     * Found in: Bread, rice, pasta, fruits, vegetables
     * 
     * Example values (per serving):
     * - Apple: 25g
     * - Brown rice (1 cup): 45g
     * - Whole wheat bread (1 slice): 12g
     */
    @Column(nullable = false)
    private Double carbohydrates;
    
    /**
     * FAT - Essential for brain and hormone production
     * 
     * Measured in: Grams (g)
     * 
     * What does fat do?
     * - Energy storage
     * - Brain development
     * - Helps absorb vitamins A, D, E, K
     * - Makes hormones
     * 
     * Types: Saturated, unsaturated, trans
     * Best: Unsaturated fats (olive oil, fish, nuts)
     * 
     * Found in: Oils, butter, nuts, avocados, fatty fish
     * 
     * Example values (per serving):
     * - Apple: 0.3g (very low)
     * - Salmon (100g): 13g (healthy fats!)
     * - Almonds (28g): 14g
     */
    @Column(nullable = false)
    private Double fat;
    
    /**
     * FIBER - Helps digestion
     * 
     * Measured in: Grams (g)
     * 
     * What does fiber do?
     * - Aids digestion
     * - Prevents constipation
     * - Keeps you feeling full
     * - Controls blood sugar
     * 
     * Found in: Fruits, vegetables, whole grains, beans
     * 
     * Example values (per serving):
     * - Apple: 4.4g (good source!)
     * - Brown rice (1 cup): 3.5g
     * - Broccoli (1 cup): 5g
     * 
     * Daily goal: 25-30g for adults, less for children
     */
    @Column(nullable = false)
    private Double fiber;
    
    // ========================================
    // VITAMINS
    // ========================================
    // These are nutrients we need in SMALL amounts
    // They help with specific body functions
    
    /**
     * VITAMIN A - For vision and immune system
     * Measured in: Micrograms (mcg or μg)
     * Found in: Carrots, sweet potatoes, spinach, dairy
     */
    @Column(nullable = false)
    private Double vitaminA;
    
    /**
     * VITAMIN C - Boosts immune system, heals wounds
     * Measured in: Milligrams (mg)
     * Found in: Oranges, strawberries, bell peppers, broccoli
     */
    @Column(nullable = false)
    private Double vitaminC;
    
    /**
     * VITAMIN D - For strong bones (helps absorb calcium)
     * Measured in: Micrograms (mcg or μg)
     * Found in: Sunlight (!), fatty fish, fortified milk, eggs
     */
    @Column(nullable = false)
    private Double vitaminD;
    
    /**
     * VITAMIN E - Protects cells (antioxidant)
     * Measured in: Milligrams (mg)
     * Found in: Nuts, seeds, vegetable oils, leafy greens
     */
    @Column(nullable = false)
    private Double vitaminE;
    
    /**
     * VITAMIN K - Helps blood clot, strengthens bones
     * Measured in: Micrograms (mcg or μg)
     * Found in: Leafy greens, broccoli, Brussels sprouts
     */
    @Column(nullable = false)
    private Double vitaminK;
    
    /**
     * VITAMIN B12 - For red blood cells and nerves
     * Measured in: Micrograms (mcg or μg)
     * Found in: Meat, fish, dairy, eggs, fortified cereals
     * Note: Vegans need supplements!
     */
    @Column(nullable = false)
    private Double vitaminB12;
    
    // ========================================
    // MINERALS
    // ========================================
    // These are elements from the earth that our bodies need
    
    /**
     * CALCIUM - Builds strong bones and teeth
     * Measured in: Milligrams (mg)
     * Found in: Milk, cheese, yogurt, leafy greens
     * SUPER IMPORTANT for growing children!
     */
    @Column(nullable = false)
    private Double calcium;
    
    /**
     * IRON - Carries oxygen in blood
     * Measured in: Milligrams (mg)
     * Found in: Red meat, beans, spinach, fortified cereals
     * Important for adolescent girls!
     */
    @Column(nullable = false)
    private Double iron;
    
    /**
     * MAGNESIUM - Helps muscles and nerves work
     * Measured in: Milligrams (mg)
     * Found in: Nuts, seeds, whole grains, leafy greens
     */
    @Column(nullable = false)
    private Double magnesium;
    
    /**
     * ZINC - Supports immune system and growth
     * Measured in: Milligrams (mg)
     * Found in: Meat, shellfish, beans, nuts, dairy
     * Important for growing children!
     */
    @Column(nullable = false)
    private Double zinc;
    
    /**
     * POTASSIUM - Regulates blood pressure and heart
     * Measured in: Milligrams (mg)
     * Found in: Bananas, potatoes, beans, yogurt
     * Fun fact: Bananas are famous for potassium!
     */
    @Column(nullable = false)
    private Double potassium;
}

/*
 * EXAMPLE: NUTRIENT PROFILE FOR A MEDIUM APPLE
 * =============================================
 * 
 * servingSize: 182g (one medium apple)
 * 
 * Macronutrients:
 * - calories: 95 kcal
 * - protein: 0.5g
 * - carbohydrates: 25g
 * - fat: 0.3g
 * - fiber: 4.4g
 * 
 * Vitamins:
 * - vitaminA: 5 mcg
 * - vitaminC: 8.4 mg
 * - vitaminD: 0 mcg
 * - vitaminE: 0.3 mg
 * - vitaminK: 4 mcg
 * - vitaminB12: 0 mcg
 * 
 * Minerals:
 * - calcium: 11 mg
 * - iron: 0.2 mg
 * - magnesium: 9 mg
 * - zinc: 0.1 mg
 * - potassium: 195 mg
 * 
 * HOW WE USE THIS DATA:
 * =====================
 * 
 * When a user logs "I ate 2 apples":
 * 1. portionSize = 2.0 (they ate 2 servings)
 * 2. We multiply ALL nutrients by 2.0:
 *    - calories: 95 × 2 = 190 kcal
 *    - protein: 0.5 × 2 = 1g
 *    - vitaminC: 8.4 × 2 = 16.8 mg
 *    - etc.
 * 3. We add these to their daily totals
 * 4. We compare totals to their daily requirements
 * 5. We identify any deficiencies
 * 
 * This is the core of our nutrition tracking system!
 */
