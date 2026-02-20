package com.nutrition.dietbalancetracker.model;

/**
 * AGE GROUP ENUMERATION
 * ======================
 * This categorizes users into age ranges for nutritional requirements.
 * 
 * Why group by age?
 * - Different ages need different amounts of nutrients
 * - A 3-year-old needs less calcium than a 15-year-old
 * - Growing adolescents have different needs than young children
 * - Makes it easier to set appropriate thresholds
 * 
 * These age groups are based on standard nutritional guidelines
 * from organizations like the USDA and WHO.
 */
public enum AgeGroup {
    
    /**
     * AGE_1_3
     * -------
     * Toddlers and very young children (1-3 years old).
     * 
     * Characteristics:
     * - Rapid growth period
     * - Developing motor skills
     * - Transitioning to solid foods
     * - Small stomach capacity
     * 
     * Nutritional needs:
     * - Lower calorie needs (1000-1400 calories/day)
     * - Need nutrient-dense foods (lots of nutrition in small portions)
     * - Critical period for brain development
     * - Building foundation for lifelong eating habits
     * 
     * Key nutrients to watch:
     * - Iron (for brain development)
     * - Calcium (for growing bones)
     * - Vitamin D (for bone health)
     * - Healthy fats (for brain development)
     * 
     * Example daily requirements:
     * - Calcium: 700 mg
     * - Iron: 7 mg
     * - Protein: 13 g
     * - Vitamin C: 15 mg
     */
    AGE_1_3,
    
    /**
     * AGE_4_8
     * -------
     * Young children (4-8 years old).
     * 
     * Characteristics:
     * - Steady growth
     * - Very active (lots of playing!)
     * - Starting school
     * - Developing food preferences
     * 
     * Nutritional needs:
     * - Moderate calorie needs (1200-2000 calories/day)
     * - Need balanced diet for energy and growth
     * - Important for cognitive development (learning)
     * - Building strong bones and muscles
     * 
     * Key nutrients to watch:
     * - Calcium (bones growing rapidly)
     * - Iron (for energy and concentration)
     * - Vitamin A (for vision and immune system)
     * - Fiber (for healthy digestion)
     * 
     * Example daily requirements:
     * - Calcium: 1000 mg
     * - Iron: 10 mg
     * - Protein: 19 g
     * - Vitamin C: 25 mg
     * 
     * Common challenges:
     * - Picky eating
     * - Skipping meals
     * - Preferring snacks over meals
     */
    AGE_4_8,
    
    /**
     * AGE_9_13
     * --------
     * Pre-teens and early adolescents (9-13 years old).
     * 
     * Characteristics:
     * - Growth spurt beginning
     * - Puberty starting for many
     * - Increased independence with food choices
     * - More involved in sports and activities
     * 
     * Nutritional needs:
     * - Higher calorie needs (1600-2600 calories/day)
     * - Increased need for most nutrients
     * - Critical period for bone mass development
     * - Supporting rapid growth and hormonal changes
     * 
     * Key nutrients to watch:
     * - Calcium (peak bone-building years!)
     * - Iron (especially for girls starting menstruation)
     * - Protein (for muscle development)
     * - Vitamin D (for calcium absorption)
     * - B vitamins (for energy metabolism)
     * 
     * Example daily requirements:
     * - Calcium: 1300 mg (highest of all age groups!)
     * - Iron: 8 mg (boys), 8-15 mg (girls)
     * - Protein: 34 g
     * - Vitamin C: 45 mg
     * 
     * Common challenges:
     * - Skipping breakfast
     * - Eating too much junk food
     * - Not drinking enough milk
     * - Irregular meal times
     */
    AGE_9_13,
    
    /**
     * AGE_14_18
     * ---------
     * Teenagers and older adolescents (14-18 years old).
     * 
     * Characteristics:
     * - Peak growth spurt
     * - Full puberty
     * - High activity levels
     * - More independent food choices
     * - Busy schedules (school, sports, social life)
     * 
     * Nutritional needs:
     * - Highest calorie needs (1800-3200 calories/day)
     * - Maximum nutrient requirements
     * - Supporting final growth phase
     * - Building peak bone mass (90% achieved by age 18!)
     * - Supporting athletic performance
     * 
     * Key nutrients to watch:
     * - Calcium (last chance to build strong bones!)
     * - Iron (especially for teenage girls - menstruation)
     * - Protein (for muscle development and growth)
     * - Zinc (for growth and immune function)
     * - B vitamins (for energy)
     * 
     * Example daily requirements:
     * - Calcium: 1300 mg
     * - Iron: 11 mg (boys), 15 mg (girls)
     * - Protein: 52 g (boys), 46 g (girls)
     * - Vitamin C: 75 mg (boys), 65 mg (girls)
     * 
     * Common challenges:
     * - Skipping meals (especially breakfast)
     * - Fast food and junk food
     * - Dieting/body image concerns
     * - Energy drinks and soda
     * - Irregular eating patterns
     * - Not enough fruits and vegetables
     * 
     * Special considerations:
     * - Athletes need even more calories and protein
     * - Girls need extra iron due to menstruation
     * - Boys need more calories during growth spurts
     * - Both need support for healthy body image
     */
    AGE_14_18;
    
    // How we use age groups:
    // 
    // 1. When a user registers, we calculate their age group from their age
    // 2. We store different nutrient thresholds for each age group in the database
    // 3. When analyzing diet, we compare their intake to their age group's requirements
    // 4. Recommendations are tailored to their age group's needs
    // 5. Admins can configure different thresholds for each age group
    // 
    // Example:
    // - User is 10 years old → AGE_9_13
    // - System looks up calcium requirement for AGE_9_13 → 1300 mg/day
    // - User's intake is 800 mg/day
    // - System calculates: 800/1300 = 61.5% (MODERATE deficiency)
    // - System recommends calcium-rich foods appropriate for 10-year-olds
    // 
    // This ensures every user gets age-appropriate guidance!
}
