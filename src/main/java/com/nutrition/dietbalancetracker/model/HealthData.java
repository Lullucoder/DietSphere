package com.nutrition.dietbalancetracker.model;

// Database and utility imports
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * HEALTH DATA ENTITY
 * ==================
 * This stores health and physical information about a user.
 * 
 * Why do we need this?
 * - To calculate personalized nutrient requirements
 * - Different body sizes need different amounts of nutrients
 * - Activity level affects how many calories you need
 * - Dietary restrictions affect what foods we can recommend
 * 
 * Think of this as a "health profile" or "medical file" for each user.
 * 
 * Relationship: One user has exactly one health data record.
 */
@Entity
@Table(name = "health_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthData {
    
    // ========================================
    // PRIMARY KEY
    // ========================================
    
    /**
     * ID - Unique identifier for this health data record
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // ========================================
    // RELATIONSHIP TO USER
    // ========================================
    
    /**
     * USER - Which user does this health data belong to?
     * 
     * Relationship: One-to-One
     * - Each health data record belongs to exactly one user
     * - Each user has exactly one health data record
     * 
     * Think of it like:
     * - User = Person
     * - HealthData = Their medical file
     * - Each medical file belongs to one person
     * 
     * @JoinColumn creates a "user_id" column in this table
     * that stores the ID of the user this belongs to.
     */
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    // ========================================
    // PHYSICAL MEASUREMENTS
    // ========================================
    
    /**
     * WEIGHT - How much does the user weigh?
     * 
     * Measured in: Kilograms (kg)
     * 
     * Why we need this:
     * - Heavier people need more calories and nutrients
     * - Used in formulas to calculate daily requirements
     * - Example: Harris-Benedict equation for calorie needs
     * 
     * Validation: Must be positive (done in service layer)
     * Example: 45.5 kg, 60.0 kg, 75.2 kg
     */
    @Column(nullable = false)
    private Double weight;
    
    /**
     * HEIGHT - How tall is the user?
     * 
     * Measured in: Centimeters (cm)
     * 
     * Why we need this:
     * - Taller people generally need more calories
     * - Used with weight to calculate BMI (Body Mass Index)
     * - Used in nutrient requirement formulas
     * 
     * Validation: Must be positive (done in service layer)
     * Example: 150.0 cm, 165.5 cm, 180.0 cm
     */
    @Column(nullable = false)
    private Double height;
    
    // ========================================
    // ACTIVITY LEVEL
    // ========================================
    
    /**
     * ACTIVITY LEVEL - How physically active is the user?
     * 
     * Options:
     * - SEDENTARY: Little to no exercise
     * - LIGHT: Light exercise 1-3 days/week
     * - MODERATE: Moderate exercise 3-5 days/week
     * - ACTIVE: Hard exercise 6-7 days/week
     * - VERY_ACTIVE: Very hard exercise & physical job
     * 
     * Why we need this:
     * - More active people burn more calories
     * - Need to eat more to maintain energy
     * - Affects calorie recommendations
     * 
     * Example calculation:
     * - Sedentary person: Base calories × 1.2
     * - Very active person: Base calories × 1.9
     * 
     * This can make a BIG difference in daily needs!
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ActivityLevel activityLevel;
    
    // ========================================
    // DIETARY RESTRICTIONS
    // ========================================
    
    /**
     * DIETARY RESTRICTIONS - What foods can't or won't the user eat?
     * 
     * This is a SET (collection) because a user can have MULTIPLE restrictions.
     * Example: Someone could be both VEGETARIAN and GLUTEN_FREE
     * 
     * Options include:
     * - VEGETARIAN, VEGAN
     * - GLUTEN_FREE, LACTOSE_FREE
     * - NUT_ALLERGY
     * - HALAL, KOSHER
     * - LOW_SODIUM, DIABETIC_FRIENDLY
     * 
     * Why we need this:
     * - Safety! (allergies can be life-threatening)
     * - Respect religious/ethical choices
     * - Only recommend foods they can actually eat
     * 
     * @ElementCollection means: Store this as a separate table
     * @CollectionTable specifies the table name
     * @Enumerated(STRING) means: Store as text, not numbers
     * 
     * Database structure:
     * - Main table: health_data
     * - Separate table: dietary_restrictions
     * - Links them by health_data_id
     */
    @ElementCollection(targetClass = DietaryRestriction.class)
    @CollectionTable(name = "dietary_restrictions", 
                     joinColumns = @JoinColumn(name = "health_data_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "restriction", length = 30)
    private Set<DietaryRestriction> dietaryRestrictions = new HashSet<>();
    
    // ========================================
    // ALLERGIES
    // ========================================
    
    /**
     * ALLERGIES - Specific foods the user is allergic to
     * 
     * This is a SET of strings for specific allergy details.
     * 
     * Why separate from dietary restrictions?
     * - More specific (e.g., "peanuts" vs general "NUT_ALLERGY")
     * - Allows free-text entry for uncommon allergies
     * - User can specify exactly what they're allergic to
     * 
     * Examples:
     * - "peanuts"
     * - "shellfish"
     * - "eggs"
     * - "soy"
     * 
     * VERY IMPORTANT for safety!
     * We must NEVER recommend foods containing these!
     * 
     * Database structure:
     * - Separate table: allergies
     * - Each allergy is one row
     * - Linked by health_data_id
     */
    @ElementCollection
    @CollectionTable(name = "allergies", 
                     joinColumns = @JoinColumn(name = "health_data_id"))
    @Column(name = "allergy", length = 100)
    private Set<String> allergies = new HashSet<>();
    
    // ========================================
    // TIMESTAMP
    // ========================================
    
    /**
     * UPDATED AT - When was this health data last updated?
     * 
     * Why track this?
     * - Health data changes over time (weight, height, activity)
     * - We want to use the most recent data
     * - Helps track changes in health profile
     * 
     * This updates automatically whenever we modify the health data.
     */
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // ========================================
    // LIFECYCLE CALLBACKS
    // ========================================
    
    /**
     * BEFORE SAVING NEW HEALTH DATA
     * 
     * Runs automatically when creating new health data.
     * Sets the initial timestamp.
     */
    @PrePersist
    protected void onCreate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * BEFORE UPDATING EXISTING HEALTH DATA
     * 
     * Runs automatically when updating health data.
     * Updates the timestamp to show when it was last modified.
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // ========================================
    // HELPER METHODS
    // ========================================
    
    /**
     * ADD A DIETARY RESTRICTION
     * 
     * Helper method to add a restriction to the set.
     * Using a method is cleaner than directly accessing the set.
     * 
     * @param restriction The restriction to add
     */
    public void addDietaryRestriction(DietaryRestriction restriction) {
        this.dietaryRestrictions.add(restriction);
    }
    
    /**
     * REMOVE A DIETARY RESTRICTION
     * 
     * Helper method to remove a restriction from the set.
     * 
     * @param restriction The restriction to remove
     */
    public void removeDietaryRestriction(DietaryRestriction restriction) {
        this.dietaryRestrictions.remove(restriction);
    }
    
    /**
     * ADD AN ALLERGY
     * 
     * Helper method to add an allergy to the set.
     * 
     * @param allergy The allergy to add (e.g., "peanuts")
     */
    public void addAllergy(String allergy) {
        this.allergies.add(allergy);
    }
    
    /**
     * REMOVE AN ALLERGY
     * 
     * Helper method to remove an allergy from the set.
     * 
     * @param allergy The allergy to remove
     */
    public void removeAllergy(String allergy) {
        this.allergies.remove(allergy);
    }
}

/*
 * HOW THIS WORKS IN THE DATABASE:
 * ================================
 * 
 * Main table: health_data
 * +----+---------+--------+--------+---------------+---------------------+
 * | id | user_id | weight | height | activity_level| updated_at          |
 * +----+---------+--------+--------+---------------+---------------------+
 * | 1  | 1       | 45.5   | 150.0  | MODERATE      | 2024-02-18 10:30:00 |
 * | 2  | 2       | 60.0   | 165.0  | ACTIVE        | 2024-02-18 11:00:00 |
 * +----+---------+--------+--------+---------------+---------------------+
 * 
 * Separate table: dietary_restrictions
 * +----------------+-------------+
 * | health_data_id | restriction |
 * +----------------+-------------+
 * | 1              | VEGETARIAN  |
 * | 1              | GLUTEN_FREE |
 * | 2              | VEGAN       |
 * +----------------+-------------+
 * 
 * Separate table: allergies
 * +----------------+----------+
 * | health_data_id | allergy  |
 * +----------------+----------+
 * | 1              | peanuts  |
 * | 2              | shellfish|
 * +----------------+----------+
 * 
 * This structure allows:
 * - One user to have multiple restrictions
 * - One user to have multiple allergies
 * - Easy to add/remove restrictions and allergies
 * - Efficient querying and filtering
 */
