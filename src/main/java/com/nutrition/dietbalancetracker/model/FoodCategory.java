package com.nutrition.dietbalancetracker.model;

/**
 * FOOD CATEGORY ENUMERATION
 * ==========================
 * This groups foods into categories to make them easier to organize and search.
 * 
 * Why categorize foods?
 * - Makes searching easier ("Show me all fruits")
 * - Helps with meal planning (need a protein? Look in PROTEIN category)
 * - Makes the UI more organized
 * - Helps with dietary recommendations
 * 
 * Think of these as "sections" in a grocery store.
 */
public enum FoodCategory {
    
    /**
     * FRUIT
     * -----
     * Fresh, dried, or frozen fruits.
     * Examples: Apples, bananas, oranges, berries, grapes
     * 
     * Typically high in: Vitamins (especially C), fiber, natural sugars
     * Good for: Quick energy, vitamin C, antioxidants
     */
    FRUIT,
    
    /**
     * VEGETABLE
     * ---------
     * All types of vegetables.
     * Examples: Broccoli, carrots, spinach, tomatoes, peppers
     * 
     * Typically high in: Vitamins, minerals, fiber
     * Good for: Overall health, vitamins A and K, minerals
     * 
     * Note: Very important for growing children!
     */
    VEGETABLE,
    
    /**
     * GRAIN
     * -----
     * Bread, rice, pasta, cereals, oats.
     * Examples: Whole wheat bread, brown rice, oatmeal, quinoa
     * 
     * Typically high in: Carbohydrates, fiber (if whole grain), B vitamins
     * Good for: Energy, fiber, B vitamins
     * 
     * Tip: Whole grains are healthier than refined grains!
     */
    GRAIN,
    
    /**
     * PROTEIN
     * -------
     * Meat, poultry, fish, eggs.
     * Examples: Chicken, beef, salmon, tuna, eggs
     * 
     * Typically high in: Protein, iron, B vitamins, zinc
     * Good for: Building muscles, growth, iron
     * 
     * Essential for: Growing children and adolescents
     */
    PROTEIN,
    
    /**
     * DAIRY
     * -----
     * Milk and milk products.
     * Examples: Milk, cheese, yogurt, butter
     * 
     * Typically high in: Calcium, protein, vitamin D
     * Good for: Strong bones and teeth
     * 
     * Very important for: Children and adolescents (bone development)
     */
    DAIRY,
    
    /**
     * LEGUME
     * ------
     * Beans, lentils, peas, chickpeas.
     * Examples: Black beans, kidney beans, lentils, chickpeas
     * 
     * Typically high in: Protein, fiber, iron, folate
     * Good for: Vegetarian protein source, fiber, iron
     * 
     * Great for: Vegetarians and vegans!
     */
    LEGUME,
    
    /**
     * NUT_SEED
     * --------
     * Nuts and seeds.
     * Examples: Almonds, walnuts, peanuts, sunflower seeds, chia seeds
     * 
     * Typically high in: Healthy fats, protein, vitamin E, minerals
     * Good for: Heart health, vitamin E, healthy fats
     * 
     * Warning: Check for nut allergies before recommending!
     */
    NUT_SEED,
    
    /**
     * BEVERAGE
     * --------
     * Drinks (excluding plain water).
     * Examples: Juice, milk, smoothies, tea
     * 
     * Varies widely: Some are nutritious (milk), some are not (soda)
     * 
     * Note: We'll track these separately from solid foods
     */
    BEVERAGE,
    
    /**
     * SNACK
     * -----
     * Snack foods (can be healthy or unhealthy).
     * Examples: Crackers, chips, popcorn, granola bars
     * 
     * Varies widely: Some are healthy (fruit bars), some are not (candy)
     * 
     * Tip: Try to recommend healthier snack options!
     */
    SNACK,
    
    /**
     * DESSERT
     * -------
     * Sweet treats and desserts.
     * Examples: Cake, cookies, ice cream, candy
     * 
     * Typically high in: Sugar, calories, fat
     * Low in: Vitamins and minerals
     * 
     * Note: Okay in moderation, but shouldn't be main nutrition source!
     */
    DESSERT,
    
    /**
     * OTHER
     * -----
     * Foods that don't fit neatly into other categories.
     * Examples: Oils, condiments, mixed dishes
     * 
     * This is our "catch-all" category for anything that doesn't
     * fit elsewhere.
     */
    OTHER;
    
    // When users search for food, they can filter by category.
    // When we recommend foods, we try to suggest a variety of categories
    // for a balanced diet!
}
