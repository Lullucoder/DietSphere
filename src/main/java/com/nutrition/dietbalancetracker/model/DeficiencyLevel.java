package com.nutrition.dietbalancetracker.model;

/**
 * DEFICIENCY LEVEL ENUMERATION
 * =============================
 * This indicates how severe a nutrient deficiency is.
 * 
 * What is a deficiency?
 * - When you're not getting enough of a nutrient
 * - Your intake is below the recommended daily amount
 * 
 * Why have different levels?
 * - Some deficiencies are more serious than others
 * - Helps prioritize which deficiencies to address first
 * - Determines how urgent the recommendations should be
 * - Affects whether we send alerts or notifications
 * 
 * Think of this like a "warning system" - from yellow to red alert!
 */
public enum DeficiencyLevel {
    
    /**
     * MILD Deficiency
     * ---------------
     * Slightly below recommended intake.
     * 
     * Criteria: Getting 70-90% of recommended daily amount
     * 
     * What this means:
     * - Not ideal, but not immediately dangerous
     * - Should try to improve intake
     * - May not notice symptoms yet
     * 
     * Example:
     * - Recommended vitamin C: 75 mg/day
     * - Your intake: 60 mg/day (80% of recommended)
     * - Level: MILD
     * 
     * Action needed:
     * - Show gentle recommendations
     * - Suggest foods rich in this nutrient
     * - No urgent alerts needed
     * 
     * Color code in UI: Yellow (caution)
     */
    MILD,
    
    /**
     * MODERATE Deficiency
     * -------------------
     * Significantly below recommended intake.
     * 
     * Criteria: Getting 50-70% of recommended daily amount
     * 
     * What this means:
     * - Definitely needs attention
     * - May start experiencing symptoms
     * - Should make dietary changes soon
     * 
     * Example:
     * - Recommended calcium: 1000 mg/day
     * - Your intake: 600 mg/day (60% of recommended)
     * - Level: MODERATE
     * 
     * Possible symptoms:
     * - Fatigue (iron deficiency)
     * - Weak bones (calcium deficiency)
     * - Poor concentration (various deficiencies)
     * 
     * Action needed:
     * - Show prominent recommendations
     * - Suggest specific meal plans
     * - Consider tracking this closely
     * 
     * Color code in UI: Orange (warning)
     */
    MODERATE,
    
    /**
     * SEVERE Deficiency
     * -----------------
     * Dangerously below recommended intake.
     * 
     * Criteria: Getting less than 50% of recommended daily amount
     * 
     * What this means:
     * - SERIOUS health concern!
     * - Likely experiencing symptoms
     * - Needs immediate attention
     * - May need to consult a doctor or nutritionist
     * 
     * Example:
     * - Recommended iron: 15 mg/day
     * - Your intake: 6 mg/day (40% of recommended)
     * - Level: SEVERE
     * 
     * Possible symptoms:
     * - Severe fatigue and weakness
     * - Dizziness
     * - Poor immune function
     * - Developmental issues in children
     * 
     * Action needed:
     * - Send immediate alert/notification
     * - Show urgent recommendations
     * - Suggest consulting healthcare provider
     * - Track daily until improved
     * - May trigger intervention system
     * 
     * Color code in UI: Red (danger)
     * 
     * Important note:
     * If a SEVERE deficiency persists for several days,
     * our system will escalate to create an intervention
     * and possibly send email notifications.
     */
    SEVERE;
    
    // How we use these levels:
    // 
    // 1. Calculate user's nutrient intake
    // 2. Compare to recommended daily amount for their age
    // 3. Calculate percentage: (actual / recommended) * 100
    // 4. Assign level based on percentage:
    //    - 90-100%+: No deficiency (all good!)
    //    - 70-90%: MILD
    //    - 50-70%: MODERATE
    //    - Below 50%: SEVERE
    // 5. Display appropriate warnings and recommendations
    // 6. For SEVERE deficiencies, trigger intervention system
}
