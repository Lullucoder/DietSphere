package com.nutrition.dietbalancetracker.model;

/**
 * NUTRIENT ENUMERATION
 * =====================
 * This lists all the nutrients we track in our application.
 * 
 * What are nutrients?
 * - Nutrients are substances in food that our bodies need to function
 * - They help us grow, stay healthy, and have energy
 * - Different foods contain different amounts of each nutrient
 * 
 * We track these nutrients to make sure users are getting enough of each one!
 */
public enum Nutrient {
    
    // ========================================
    // MACRONUTRIENTS
    // ========================================
    // These are nutrients we need in LARGE amounts (grams per day)
    // They provide energy and are the building blocks of our body
    
    /**
     * CALORIES
     * --------
     * Energy from food (measured in kcal or Calories).
     * 
     * What they do: Provide energy for everything we do
     * Found in: All foods (especially carbs, fats, proteins)
     * Daily need: Varies by age, size, and activity level
     * 
     * Too little: Fatigue, weakness, poor growth
     * Too much: Weight gain
     */
    CALORIES,
    
    /**
     * PROTEIN
     * -------
     * Building blocks for muscles, organs, and immune system.
     * Measured in grams (g).
     * 
     * What it does: Builds and repairs body tissues, makes enzymes
     * Found in: Meat, fish, eggs, dairy, beans, nuts
     * Daily need: About 0.8-1g per kg of body weight
     * 
     * Too little: Weak muscles, slow growth, poor immune system
     * Very important for: Growing children and adolescents!
     */
    PROTEIN,
    
    /**
     * CARBOHYDRATES
     * -------------
     * Main source of energy for the body and brain.
     * Measured in grams (g).
     * 
     * What they do: Provide quick energy, fuel for brain
     * Found in: Bread, rice, pasta, fruits, vegetables
     * Daily need: About 45-65% of total calories
     * 
     * Types: Simple (sugars) and complex (starches, fiber)
     * Best choice: Complex carbs (whole grains) over simple sugars
     */
    CARBOHYDRATES,
    
    /**
     * FAT
     * ---
     * Essential for brain development and hormone production.
     * Measured in grams (g).
     * 
     * What it does: Energy storage, brain development, vitamin absorption
     * Found in: Oils, butter, nuts, avocados, fatty fish
     * Daily need: About 25-35% of total calories
     * 
     * Types: Saturated, unsaturated, trans fats
     * Best choice: Unsaturated fats (olive oil, fish, nuts)
     * Avoid: Trans fats (processed foods)
     */
    FAT,
    
    /**
     * FIBER
     * -----
     * Helps digestion and keeps you feeling full.
     * Measured in grams (g).
     * 
     * What it does: Aids digestion, prevents constipation, controls blood sugar
     * Found in: Fruits, vegetables, whole grains, beans
     * Daily need: 25-30g for adults, less for children
     * 
     * Too little: Digestive problems, constipation
     * Bonus: Helps maintain healthy weight!
     */
    FIBER,
    
    // ========================================
    // VITAMINS
    // ========================================
    // These are nutrients we need in SMALL amounts (milligrams or micrograms)
    // They help with specific body functions
    
    /**
     * VITAMIN_A
     * ---------
     * Important for vision, immune system, and skin.
     * Measured in micrograms (mcg or μg).
     * 
     * What it does: Helps you see (especially in dim light), fights infections
     * Found in: Carrots, sweet potatoes, spinach, dairy, eggs
     * Daily need: 300-900 mcg depending on age
     * 
     * Too little: Night blindness, weak immune system, dry skin
     * Fun fact: Makes carrots orange!
     */
    VITAMIN_A,
    
    /**
     * VITAMIN_C
     * ---------
     * Boosts immune system and helps heal wounds.
     * Measured in milligrams (mg).
     * 
     * What it does: Fights colds, heals cuts, helps absorb iron
     * Found in: Oranges, strawberries, bell peppers, broccoli
     * Daily need: 15-90 mg depending on age
     * 
     * Too little: Weak immune system, slow healing, scurvy (rare)
     * Fun fact: Sailors used to get scurvy from lack of vitamin C!
     */
    VITAMIN_C,
    
    /**
     * VITAMIN_D
     * ---------
     * Essential for strong bones and teeth.
     * Measured in micrograms (mcg or μg).
     * 
     * What it does: Helps body absorb calcium, builds strong bones
     * Found in: Sunlight (!), fatty fish, fortified milk, eggs
     * Daily need: 15-20 mcg depending on age
     * 
     * Too little: Weak bones, rickets in children
     * Special note: Your body makes this from sunlight!
     * Tip: Spend some time outside every day!
     */
    VITAMIN_D,
    
    /**
     * VITAMIN_E
     * ---------
     * Protects cells from damage (antioxidant).
     * Measured in milligrams (mg).
     * 
     * What it does: Protects cells, supports immune system
     * Found in: Nuts, seeds, vegetable oils, leafy greens
     * Daily need: 6-15 mg depending on age
     * 
     * Too little: Rare, but can cause nerve damage
     */
    VITAMIN_E,
    
    /**
     * VITAMIN_K
     * ---------
     * Helps blood clot and builds strong bones.
     * Measured in micrograms (mcg or μg).
     * 
     * What it does: Stops bleeding when you get cut, strengthens bones
     * Found in: Leafy greens (kale, spinach), broccoli, Brussels sprouts
     * Daily need: 30-120 mcg depending on age
     * 
     * Too little: Excessive bleeding, weak bones
     */
    VITAMIN_K,
    
    /**
     * VITAMIN_B12
     * -----------
     * Needed for red blood cells and nerve function.
     * Measured in micrograms (mcg or μg).
     * 
     * What it does: Makes red blood cells, keeps nerves healthy
     * Found in: Meat, fish, dairy, eggs, fortified cereals
     * Daily need: 0.9-2.4 mcg depending on age
     * 
     * Too little: Anemia (tired, weak), nerve problems
     * Important note: Vegans need supplements or fortified foods!
     */
    VITAMIN_B12,
    
    // ========================================
    // MINERALS
    // ========================================
    // These are elements from the earth that our bodies need
    
    /**
     * CALCIUM
     * -------
     * Builds strong bones and teeth.
     * Measured in milligrams (mg).
     * 
     * What it does: Builds bones/teeth, helps muscles contract
     * Found in: Milk, cheese, yogurt, leafy greens, fortified foods
     * Daily need: 700-1300 mg depending on age
     * 
     * Too little: Weak bones, osteoporosis later in life
     * SUPER IMPORTANT for: Children and adolescents (bones are growing!)
     */
    CALCIUM,
    
    /**
     * IRON
     * ----
     * Carries oxygen in blood.
     * Measured in milligrams (mg).
     * 
     * What it does: Helps red blood cells carry oxygen throughout body
     * Found in: Red meat, beans, spinach, fortified cereals
     * Daily need: 7-15 mg depending on age and gender
     * 
     * Too little: Anemia (tired, pale, weak, can't concentrate)
     * Important for: Adolescent girls (lose iron during menstruation)
     * Tip: Vitamin C helps your body absorb iron better!
     */
    IRON,
    
    /**
     * MAGNESIUM
     * ---------
     * Helps muscles and nerves work properly.
     * Measured in milligrams (mg).
     * 
     * What it does: Muscle function, nerve signals, energy production
     * Found in: Nuts, seeds, whole grains, leafy greens, beans
     * Daily need: 80-410 mg depending on age
     * 
     * Too little: Muscle cramps, fatigue, irregular heartbeat
     */
    MAGNESIUM,
    
    /**
     * ZINC
     * ----
     * Supports immune system and wound healing.
     * Measured in milligrams (mg).
     * 
     * What it does: Fights infections, heals wounds, helps with growth
     * Found in: Meat, shellfish, beans, nuts, dairy
     * Daily need: 3-11 mg depending on age
     * 
     * Too little: Weak immune system, slow growth, poor wound healing
     * Important for: Growing children and adolescents!
     */
    ZINC,
    
    /**
     * POTASSIUM
     * ---------
     * Regulates blood pressure and heart function.
     * Measured in milligrams (mg).
     * 
     * What it does: Controls blood pressure, helps muscles contract
     * Found in: Bananas, potatoes, beans, yogurt, leafy greens
     * Daily need: 2000-3400 mg depending on age
     * 
     * Too little: Muscle weakness, irregular heartbeat, high blood pressure
     * Fun fact: Bananas are famous for potassium!
     */
    POTASSIUM;
    
    // When we analyze a user's diet, we calculate their intake of each of these nutrients.
    // Then we compare it to the recommended daily amounts for their age.
    // If they're not getting enough of any nutrient, we flag it as a deficiency
    // and recommend foods that are rich in that nutrient!
}
