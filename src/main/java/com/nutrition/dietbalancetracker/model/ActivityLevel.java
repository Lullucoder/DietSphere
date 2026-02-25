package com.nutrition.dietbalancetracker.model;

/**
 * ACTIVITY LEVEL ENUMERATION
 * ===========================
 * This represents how physically active a person is.
 * 
 * Why do we need this?
 * - More active people need more calories and nutrients
 * - This helps us calculate personalized daily requirements
 * - A child who plays sports needs different nutrition than one who doesn't
 * 
 * These levels are based on standard nutritional guidelines.
 */
public enum ActivityLevel {
    
    /**
     * SEDENTARY
     * ---------
     * Little to no exercise.
     * Examples:
     * - Mostly sitting (desk work, watching TV, reading)
     * - Less than 30 minutes of activity per day
     * - No regular sports or exercise
     * 
     * Calorie multiplier: Lowest
     */
    SEDENTARY,
    
    /**
     * LIGHT
     * -----
     * Light exercise 1-3 days per week.
     * Examples:
     * - Walking to school
     * - Playing outside occasionally
     * - Light household chores
     * - PE class once or twice a week
     * 
     * Calorie multiplier: Slightly higher than sedentary
     */
    LIGHT,
    
    /**
     * MODERATE
     * --------
     * Moderate exercise 3-5 days per week.
     * Examples:
     * - Regular PE classes
     * - Playing sports a few times a week
     * - Biking or swimming regularly
     * - Active play most days
     * 
     * Calorie multiplier: Medium
     */
    MODERATE,
    
    /**
     * ACTIVE
     * ------
     * Hard exercise 6-7 days per week.
     * Examples:
     * - Daily sports practice
     * - Training for competitions
     * - Very active lifestyle
     * - Multiple sports or activities
     * 
     * Calorie multiplier: High
     */
    ACTIVE,
    
    /**
     * VERY_ACTIVE
     * -----------
     * Very hard exercise and physical job or training twice per day.
     * Examples:
     * - Competitive athletes
     * - Training multiple times per day
     * - Very intense physical activity
     * - Professional sports training
     * 
     * Calorie multiplier: Highest
     * 
     * Note: This level is rare for most children/adolescents
     * unless they're serious athletes.
     */
    VERY_ACTIVE;
    
    // When calculating daily nutrient requirements, we'll use these levels
    // to adjust the base requirements up or down.
    // More active = more calories and nutrients needed!
}
