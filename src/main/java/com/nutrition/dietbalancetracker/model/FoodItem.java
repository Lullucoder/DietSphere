package com.nutrition.dietbalancetracker.model;

// Database and utility imports
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * FOOD ITEM ENTITY
 * ================
 * This represents a food item in our database.
 * 
 * What is a food item?
 * - Any food that users can log (apple, chicken, rice, etc.)
 * - Each food has nutritional information (stored in NutrientProfile)
 * - Can be system foods (added by admin) or custom foods (added by users)
 * 
 * Think of this as:
 * - A "food card" in a nutrition database
 * - Like an entry in a food encyclopedia
 * - Contains basic info about the food
 * 
 * Examples:
 * - "Apple" (FRUIT category)
 * - "Chicken Breast" (PROTEIN category)
 * - "Brown Rice" (GRAIN category)
 */
@Entity
@Table(name = "food_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodItem {
    
    // ========================================
    // PRIMARY KEY
    // ========================================
    
    /**
     * ID - Unique identifier for this food item
     * 
     * The database automatically generates this number.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // ========================================
    // BASIC FOOD INFORMATION
    // ========================================
    
    /**
     * NAME - What is this food called?
     * 
     * Examples:
     * - "Apple"
     * - "Chicken Breast"
     * - "Brown Rice"
     * - "Whole Wheat Bread"
     * 
     * Rules:
     * - Cannot be null (every food needs a name!)
     * - Should be clear and descriptive
     * - Users will search by this name
     */
    @Column(nullable = false, length = 100)
    private String name;
    
    /**
     * DESCRIPTION - Additional details about the food
     * 
     * Optional field for extra information.
     * 
     * Examples:
     * - "Fresh, medium-sized apple"
     * - "Skinless, boneless chicken breast"
     * - "Cooked brown rice"
     * 
     * This helps users know exactly what food they're selecting.
     */
    @Column(length = 500)
    private String description;
    
    /**
     * CATEGORY - What type of food is this?
     * 
     * Categories help organize foods and make searching easier.
     * 
     * Options:
     * - FRUIT, VEGETABLE, GRAIN
     * - PROTEIN, DAIRY, LEGUME
     * - NUT_SEED, BEVERAGE, SNACK
     * - DESSERT, OTHER
     * 
     * Why categorize?
     * - Makes searching easier ("Show me all fruits")
     * - Helps with meal planning
     * - Makes the UI more organized
     * 
     * Example: "Apple" → FRUIT category
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FoodCategory category;
    
    // ========================================
    // RELATIONSHIP TO NUTRIENT PROFILE
    // ========================================
    
    /**
     * NUTRIENT PROFILE - The nutritional information for this food
     * 
     * Relationship: One-to-One
     * - Each food item has exactly one nutrient profile
     * - Each nutrient profile belongs to exactly one food item
     * 
     * Think of it like:
     * - FoodItem = The food's name and basic info
     * - NutrientProfile = The "nutrition facts label"
     * - Every food has one nutrition label
     * 
     * mappedBy = "foodItem" means NutrientProfile has a "foodItem" field
     * cascade = ALL means: if we delete a food, delete its nutrient profile too
     * orphanRemoval = true means: if profile loses its food, delete it
     * 
     * This keeps the data clean - no orphaned nutrient profiles!
     */
    @OneToOne(mappedBy = "foodItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private NutrientProfile nutrientProfile;
    
    // ========================================
    // STATUS FLAGS
    // ========================================
    
    /**
     * IS ACTIVE - Is this food currently available?
     * 
     * Why do we need this?
     * - Instead of deleting foods, we "deactivate" them
     * - Preserves historical data (past dietary entries still valid)
     * - Can be reactivated later if needed
     * 
     * true = Food is available for selection
     * false = Food is hidden (soft deleted)
     * 
     * Example use case:
     * - Admin removes "Sugary Cereal X" from database
     * - We set isActive = false instead of deleting
     * - Users who logged it before can still see their history
     * - New users can't select it anymore
     * 
     * This is called "soft delete" - much safer than hard delete!
     */
    @Column(nullable = false)
    private Boolean isActive = true;
    
    /**
     * IS CUSTOM - Was this food added by a user?
     * 
     * Two types of foods:
     * 1. System foods (isCustom = false)
     *    - Added by admins
     *    - Available to all users
     *    - Carefully verified nutritional data
     * 
     * 2. Custom foods (isCustom = true)
     *    - Added by individual users
     *    - Only visible to that user
     *    - User-provided nutritional data
     * 
     * Why distinguish?
     * - Custom foods might have less accurate data
     * - System foods are "official" and verified
     * - Helps with data quality
     */
    @Column(nullable = false)
    private Boolean isCustom = false;
    
    // ========================================
    // RELATIONSHIP TO USER (for custom foods)
    // ========================================
    
    /**
     * CREATED BY - Which user created this food?
     * 
     * Only relevant for custom foods (isCustom = true).
     * For system foods, this is null.
     * 
     * Why track this?
     * - Custom foods are private to the user who created them
     * - Prevents other users from seeing someone's custom entries
     * - Allows users to manage their own custom foods
     * 
     * Example:
     * - User creates "Mom's Special Pasta"
     * - createdBy = that user
     * - Only that user can see and use this food
     * 
     * @ManyToOne because:
     * - One user can create many custom foods
     * - Each custom food is created by one user
     */
    @ManyToOne
    @JoinColumn(name = "created_by_user_id")
    private User createdBy;
    
    // ========================================
    // VERSIONING
    // ========================================
    
    /**
     * VERSION - Which version of this food's data is this?
     * 
     * Why version foods?
     * - Nutritional data can be updated (new research, recipe changes)
     * - We want to track when changes were made
     * - Helps maintain data integrity
     * 
     * How it works:
     * - Starts at version 1
     * - Each time we update nutrient profile, increment version
     * - Can track history of changes
     * 
     * Example:
     * - "Apple" created → version = 1
     * - Vitamin C data updated → version = 2
     * - Fiber data corrected → version = 3
     * 
     * This is optional but good practice for data management!
     */
    @Column(nullable = false)
    private Integer version = 1;
    
    // ========================================
    // TIMESTAMP
    // ========================================
    
    /**
     * CREATED AT - When was this food added to the database?
     * 
     * Useful for:
     * - Tracking when foods were added
     * - Sorting by newest foods
     * - Auditing purposes
     * 
     * This never changes - it's a permanent record.
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // ========================================
    // LIFECYCLE CALLBACKS
    // ========================================
    
    /**
     * BEFORE SAVING A NEW FOOD ITEM
     * 
     * Runs automatically when creating a new food.
     * Sets the creation timestamp.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    
    // ========================================
    // HELPER METHODS
    // ========================================
    
    /**
     * SET NUTRIENT PROFILE
     * 
     * Helper method to set the nutrient profile and maintain the relationship.
     * This ensures both sides of the relationship are set correctly.
     * 
     * @param profile The nutrient profile to attach to this food
     */
    public void setNutrientProfile(NutrientProfile profile) {
        this.nutrientProfile = profile;
        if (profile != null) {
            profile.setFoodItem(this);
        }
    }
    
    /**
     * DEACTIVATE THIS FOOD
     * 
     * Helper method to soft-delete this food.
     * Sets isActive to false instead of actually deleting.
     */
    public void deactivate() {
        this.isActive = false;
    }
    
    /**
     * REACTIVATE THIS FOOD
     * 
     * Helper method to make this food available again.
     */
    public void reactivate() {
        this.isActive = true;
    }
    
    /**
     * INCREMENT VERSION
     * 
     * Helper method to bump the version number.
     * Call this when updating nutritional data.
     */
    public void incrementVersion() {
        this.version++;
    }
}

/*
 * HOW THIS WORKS IN THE DATABASE:
 * ================================
 * 
 * Table: food_items
 * +----+----------------+-------------+----------+-----------+----------+-----------+------------------+---------------------+
 * | id | name           | description | category | is_active | is_custom| version   | created_by_user  | created_at          |
 * +----+----------------+-------------+----------+-----------+----------+-----------+------------------+---------------------+
 * | 1  | Apple          | Fresh apple | FRUIT    | true      | false    | 1         | null             | 2024-02-18 10:00:00 |
 * | 2  | Chicken Breast | Skinless    | PROTEIN  | true      | false    | 1         | null             | 2024-02-18 10:05:00 |
 * | 3  | Mom's Pasta    | Special     | OTHER    | true      | true     | 1         | 5                | 2024-02-18 15:30:00 |
 * +----+----------------+-------------+----------+-----------+----------+-----------+------------------+---------------------+
 * 
 * Notes:
 * - Row 1 & 2: System foods (isCustom=false, createdBy=null) - available to everyone
 * - Row 3: Custom food (isCustom=true, createdBy=5) - only for user #5
 * - Each food will have a corresponding row in nutrient_profiles table
 * 
 * When a user searches for "apple":
 * 1. Find all food_items where name contains "apple" AND isActive = true
 * 2. If isCustom = true, check if createdBy matches current user
 * 3. Load the nutrient_profile for each matching food
 * 4. Return results to user
 */
