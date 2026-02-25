package com.nutrition.dietbalancetracker.model;

/**
 * DIETARY RESTRICTION ENUMERATION
 * ================================
 * This represents special dietary needs or restrictions a user might have.
 * 
 * Why is this important?
 * - Some people can't eat certain foods (allergies, health conditions)
 * - Some people choose not to eat certain foods (religious, ethical reasons)
 * - We need to avoid recommending foods they can't or won't eat
 * 
 * A user can have MULTIPLE restrictions at the same time.
 * For example: someone could be both VEGETARIAN and GLUTEN_FREE.
 */
public enum DietaryRestriction {
    
    /**
     * VEGETARIAN
     * ----------
     * Does not eat meat, poultry, or fish.
     * Still eats: Dairy products, eggs, plants
     * 
     * We won't recommend: Chicken, beef, pork, fish, seafood
     */
    VEGETARIAN,
    
    /**
     * VEGAN
     * -----
     * Does not eat ANY animal products.
     * Only eats: Plants, grains, fruits, vegetables, nuts, seeds
     * 
     * We won't recommend: Meat, fish, dairy, eggs, honey
     * 
     * Note: Vegans need to be extra careful about vitamin B12, iron, and calcium!
     */
    VEGAN,
    
    /**
     * GLUTEN_FREE
     * -----------
     * Cannot eat gluten (a protein found in wheat, barley, rye).
     * Common reason: Celiac disease or gluten sensitivity
     * 
     * We won't recommend: Bread, pasta, cereals with wheat/barley/rye
     * Safe foods: Rice, corn, potatoes, fruits, vegetables, meat, dairy
     */
    GLUTEN_FREE,
    
    /**
     * LACTOSE_FREE
     * ------------
     * Cannot digest lactose (sugar in milk).
     * Common reason: Lactose intolerance
     * 
     * We won't recommend: Milk, cheese, yogurt, ice cream
     * Alternatives: Lactose-free milk, almond milk, soy milk
     * 
     * Note: Need to find other calcium sources!
     */
    LACTOSE_FREE,
    
    /**
     * NUT_ALLERGY
     * -----------
     * Allergic to nuts (can be life-threatening!).
     * 
     * We won't recommend: Peanuts, almonds, cashews, walnuts, etc.
     * Also avoid: Foods that might contain traces of nuts
     * 
     * This is VERY serious - even small amounts can cause severe reactions.
     */
    NUT_ALLERGY,
    
    /**
     * HALAL
     * -----
     * Follows Islamic dietary laws.
     * 
     * We won't recommend: Pork, alcohol, non-halal meat
     * Must eat: Halal-certified meat, seafood, plants
     */
    HALAL,
    
    /**
     * KOSHER
     * ------
     * Follows Jewish dietary laws.
     * 
     * We won't recommend: Pork, shellfish, mixing meat and dairy
     * Must eat: Kosher-certified foods
     */
    KOSHER,
    
    /**
     * LOW_SODIUM
     * ----------
     * Needs to limit salt intake.
     * Common reason: High blood pressure, heart conditions
     * 
     * We won't recommend: Salty snacks, processed foods, canned soups
     * Recommend: Fresh fruits, vegetables, unsalted foods
     */
    LOW_SODIUM,
    
    /**
     * DIABETIC_FRIENDLY
     * -----------------
     * Needs to manage blood sugar levels.
     * Common reason: Diabetes or pre-diabetes
     * 
     * We won't recommend: High-sugar foods, sugary drinks, candy
     * Recommend: Whole grains, vegetables, lean proteins
     * Focus on: Low glycemic index foods
     */
    DIABETIC_FRIENDLY;
    
    // When generating food recommendations, we'll check these restrictions
    // and filter out any foods that don't match the user's needs.
    // Safety first!
}
