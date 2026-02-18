package com.nutrition.dietbalancetracker.model;

/**
 * MEAL TYPE ENUMERATION
 * ======================
 * This represents when during the day a food was eaten.
 * 
 * Why track meal types?
 * - Helps users see their eating patterns
 * - Some nutrients are better absorbed at certain times
 * - Helps with meal planning and recommendations
 * - Makes the food diary more organized
 * 
 * Think of this as "time slots" for eating during the day.
 */
public enum MealType {
    
    /**
     * BREAKFAST
     * ---------
     * The first meal of the day, usually eaten in the morning.
     * 
     * Typical time: 6 AM - 10 AM
     * 
     * Why it's important:
     * - "Breaks the fast" from sleeping
     * - Gives energy to start the day
     * - Helps with concentration at school
     * - Studies show breakfast eaters do better in school!
     * 
     * Common foods: Cereal, eggs, toast, fruit, milk, juice
     * 
     * Tip: A good breakfast should include protein and whole grains
     * for lasting energy!
     */
    BREAKFAST,
    
    /**
     * LUNCH
     * -----
     * The midday meal.
     * 
     * Typical time: 11 AM - 2 PM
     * 
     * Why it's important:
     * - Refuels energy for the afternoon
     * - Helps maintain focus and concentration
     * - Prevents getting too hungry before dinner
     * 
     * Common foods: Sandwiches, salads, leftovers, soup, fruit
     * 
     * Tip: Try to include vegetables and protein to stay full
     * until dinner!
     */
    LUNCH,
    
    /**
     * DINNER
     * ------
     * The evening meal, usually the largest meal of the day.
     * 
     * Typical time: 5 PM - 8 PM
     * 
     * Why it's important:
     * - Often eaten with family (social time!)
     * - Provides nutrients for overnight recovery
     * - Helps body repair and grow during sleep
     * 
     * Common foods: Meat/protein, vegetables, rice/pasta, salad
     * 
     * Tip: Try to eat dinner at least 2-3 hours before bedtime
     * for better digestion and sleep!
     */
    DINNER,
    
    /**
     * SNACK
     * -----
     * Small amounts of food eaten between main meals.
     * 
     * Typical times: Mid-morning, mid-afternoon, or evening
     * 
     * Why snacks are okay:
     * - Prevents getting too hungry between meals
     * - Provides extra energy for active kids
     * - Can help meet daily nutrient needs
     * - Keeps metabolism steady
     * 
     * Common foods: Fruit, yogurt, nuts, crackers, vegetables
     * 
     * Important notes:
     * - Snacks should be SMALL (not meal-sized!)
     * - Choose healthy snacks when possible
     * - Too many snacks can spoil appetite for main meals
     * 
     * Healthy snack ideas:
     * - Apple slices with peanut butter
     * - Carrot sticks with hummus
     * - Yogurt with berries
     * - A handful of nuts
     * - Cheese and whole grain crackers
     * 
     * Less healthy (eat occasionally):
     * - Chips
     * - Candy
     * - Cookies
     * - Soda
     */
    SNACK;
    
    // When users log their food, they select which meal type it was.
    // This helps us:
    // 1. Organize their food diary by time of day
    // 2. See if they're skipping meals (like breakfast)
    // 3. Check if they're eating too many snacks
    // 4. Give better recommendations (like "try adding protein to breakfast")
}
