package com.nutrition.dietbalancetracker.model;

// Database and utility imports
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * DIETARY ENTRY ENTITY
 * =====================
 * This represents ONE meal or snack that a user has logged.
 * 
 * Think of this as:
 * - An entry in a food diary
 * - A record of "I ate this food at this time"
 * - One line in a meal log
 * 
 * What information does it store?
 * - WHO ate it (which user)
 * - WHAT they ate (which food item)
 * - HOW MUCH they ate (portion size)
 * - WHEN they ate it (timestamp)
 * - WHAT MEAL it was (breakfast, lunch, dinner, snack)
 * 
 * Example entries:
 * - "John ate 1 apple for snack at 3:00 PM"
 * - "Sarah ate 1.5 servings of chicken breast for dinner at 7:30 PM"
 * - "Mike ate 2 slices of bread for breakfast at 8:00 AM"
 * 
 * These entries are the foundation of our nutrition tracking!
 */
@Entity
@Table(name = "dietary_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DietaryEntry {
    
    // ========================================
    // PRIMARY KEY
    // ========================================
    
    /**
     * ID - Unique identifier for this dietary entry
     * 
     * Each time a user logs food, we create a new entry with a unique ID.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // ========================================
    // RELATIONSHIPS
    // ========================================
    
    /**
     * USER - Who ate this food?
     * 
     * Relationship: Many-to-One
     * - Many dietary entries can belong to one user
     * - Each dietary entry belongs to exactly one user
     * 
     * Think of it like:
     * - User = Person
     * - DietaryEntry = One meal they ate
     * - A person eats many meals
     * 
     * Why we need this:
     * - To know whose food diary this entry belongs to
     * - To calculate that user's total nutrition
     * - To ensure users only see their own entries
     * 
     * @ManyToOne creates a "user_id" column in this table
     * that stores which user this entry belongs to.
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    /**
     * FOOD ITEM - What food did they eat?
     * 
     * Relationship: Many-to-One
     * - Many dietary entries can reference one food item
     * - Each dietary entry references exactly one food item
     * 
     * Think of it like:
     * - FoodItem = A food in the database (like "Apple")
     * - DietaryEntry = Someone eating that food
     * - Many people can eat apples (many entries for one food)
     * 
     * Why we need this:
     * - To know what food was eaten
     * - To get the nutritional information from the food's nutrient profile
     * - To calculate nutrients consumed
     * 
     * @ManyToOne creates a "food_item_id" column
     * that stores which food was eaten.
     */
    @ManyToOne
    @JoinColumn(name = "food_item_id", nullable = false)
    private FoodItem foodItem;
    
    // ========================================
    // PORTION INFORMATION
    // ========================================
    
    /**
     * PORTION SIZE - How much did they eat?
     * 
     * This is a MULTIPLIER of the food's serving size.
     * 
     * What does this mean?
     * - 1.0 = Ate exactly one serving
     * - 2.0 = Ate two servings (double the nutrients)
     * - 0.5 = Ate half a serving (half the nutrients)
     * - 1.5 = Ate one and a half servings
     * 
     * Examples:
     * - Food: Apple (serving size = 182g)
     * - portionSize = 1.0 → ate 182g (one apple)
     * - portionSize = 2.0 → ate 364g (two apples)
     * - portionSize = 0.5 → ate 91g (half an apple)
     * 
     * How we calculate nutrients:
     * - Get nutrient values from food's NutrientProfile
     * - Multiply each nutrient by portionSize
     * - Example: Apple has 95 calories per serving
     *   - If portionSize = 2.0 → consumed 95 × 2 = 190 calories
     *   - If portionSize = 0.5 → consumed 95 × 0.5 = 47.5 calories
     * 
     * This allows flexible tracking - users can log any amount!
     */
    @Column(nullable = false)
    private Double portionSize;
    
    // ========================================
    // TIME INFORMATION
    // ========================================
    
    /**
     * CONSUMED AT - When did they eat this?
     * 
     * Stores the exact date and time the food was eaten.
     * 
     * Why is this important?
     * - To organize entries by date (food diary)
     * - To calculate daily/weekly/monthly totals
     * - To detect patterns (do they skip breakfast?)
     * - To track when deficiencies occur
     * 
     * Format: "2024-02-18T14:30:00"
     * - Date: 2024-02-18 (February 18, 2024)
     * - Time: 14:30:00 (2:30 PM)
     * 
     * Users can log food for:
     * - Right now (most common)
     * - Earlier today
     * - Previous days (catching up on logging)
     */
    @Column(nullable = false)
    private LocalDateTime consumedAt;
    
    /**
     * MEAL TYPE - What meal was this?
     * 
     * Options:
     * - BREAKFAST: Morning meal
     * - LUNCH: Midday meal
     * - DINNER: Evening meal
     * - SNACK: Between-meal snack
     * 
     * Why track meal type?
     * - Helps organize the food diary
     * - Can analyze eating patterns
     * - Can check if user skips meals
     * - Makes the UI more organized
     * 
     * Example use:
     * - Show all breakfast entries
     * - Check if user ate lunch today
     * - Recommend breakfast foods if they skip breakfast often
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MealType mealType;
    
    // ========================================
    // METADATA
    // ========================================
    
    /**
     * CREATED AT - When was this entry logged in the system?
     * 
     * This is different from consumedAt!
     * - consumedAt = When they actually ate the food
     * - createdAt = When they logged it in our app
     * 
     * Example:
     * - User ate breakfast at 8:00 AM (consumedAt)
     * - User logged it at 9:00 AM (createdAt)
     * 
     * Why track both?
     * - Users might log food later
     * - Helps with data auditing
     * - Can detect if users are logging regularly
     * 
     * This is set automatically when the entry is created.
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // ========================================
    // LIFECYCLE CALLBACKS
    // ========================================
    
    /**
     * BEFORE SAVING A NEW ENTRY
     * 
     * Runs automatically when creating a new dietary entry.
     * Sets the createdAt timestamp to right now.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    
    // ========================================
    // HELPER METHODS
    // ========================================
    
    /**
     * CALCULATE ACTUAL NUTRIENTS CONSUMED
     * 
     * This helper method calculates how much of a specific nutrient
     * was consumed in this entry.
     * 
     * Formula: nutrient value × portion size
     * 
     * Example:
     * - Food: Apple
     * - Vitamin C per serving: 8.4 mg
     * - Portion size: 2.0 (ate 2 apples)
     * - Actual vitamin C consumed: 8.4 × 2.0 = 16.8 mg
     * 
     * @param nutrientPerServing The nutrient value from the food's profile
     * @return The actual amount consumed
     */
    public Double calculateActualNutrient(Double nutrientPerServing) {
        return nutrientPerServing * this.portionSize;
    }
}

/*
 * HOW THIS WORKS IN THE DATABASE:
 * ================================
 * 
 * Table: dietary_entries
 * +----+---------+--------------+--------------+---------------------+-----------+---------------------+
 * | id | user_id | food_item_id | portion_size | consumed_at         | meal_type | created_at          |
 * +----+---------+--------------+--------------+---------------------+-----------+---------------------+
 * | 1  | 5       | 1            | 1.0          | 2024-02-18 08:00:00 | BREAKFAST | 2024-02-18 08:05:00 |
 * | 2  | 5       | 2            | 1.5          | 2024-02-18 12:30:00 | LUNCH     | 2024-02-18 12:35:00 |
 * | 3  | 5       | 1            | 2.0          | 2024-02-18 15:00:00 | SNACK     | 2024-02-18 15:02:00 |
 * | 4  | 7       | 3            | 1.0          | 2024-02-18 19:00:00 | DINNER    | 2024-02-18 19:10:00 |
 * +----+---------+--------------+--------------+---------------------+-----------+---------------------+
 * 
 * Reading this table:
 * - Row 1: User #5 ate 1 serving of food #1 (Apple) for breakfast at 8 AM
 * - Row 2: User #5 ate 1.5 servings of food #2 (Chicken) for lunch at 12:30 PM
 * - Row 3: User #5 ate 2 servings of food #1 (Apple) as snack at 3 PM
 * - Row 4: User #7 ate 1 serving of food #3 (Rice) for dinner at 7 PM
 * 
 * HOW WE USE THIS FOR NUTRITION ANALYSIS:
 * ========================================
 * 
 * To calculate User #5's nutrition for Feb 18:
 * 
 * 1. Find all entries where user_id = 5 AND date = 2024-02-18
 *    → Rows 1, 2, 3
 * 
 * 2. For each entry:
 *    a. Get the food_item and its nutrient_profile
 *    b. Multiply each nutrient by portion_size
 *    c. Add to daily totals
 * 
 * 3. Example for calories:
 *    - Entry 1: Apple (95 cal) × 1.0 = 95 cal
 *    - Entry 2: Chicken (165 cal) × 1.5 = 247.5 cal
 *    - Entry 3: Apple (95 cal) × 2.0 = 190 cal
 *    - Total: 95 + 247.5 + 190 = 532.5 calories
 * 
 * 4. Compare to daily requirement (e.g., 2000 cal)
 *    - 532.5 / 2000 = 26.6% of daily calories
 *    - This is LOW - user needs to eat more!
 * 
 * 5. Repeat for all 16 nutrients we track
 * 
 * 6. Identify deficiencies and generate recommendations
 * 
 * This is the core of our nutrition tracking system!
 */
