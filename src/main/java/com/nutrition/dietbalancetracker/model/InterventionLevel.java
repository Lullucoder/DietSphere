package com.nutrition/dietbalancetracker/model;

/**
 * INTERVENTION LEVEL ENUMERATION
 * ===============================
 * This indicates how urgently we need to intervene when a deficiency persists.
 * 
 * What is an intervention?
 * - An alert or action taken when a deficiency continues for multiple days
 * - More serious than just showing a recommendation
 * - May include email notifications or escalated warnings
 * 
 * Why have intervention levels?
 * - Some situations need immediate attention
 * - Helps prioritize which users need help most urgently
 * - Determines what actions to take (just show alert vs. send email)
 * 
 * Think of this as an "escalation system" - the longer a problem persists,
 * the more serious it becomes!
 */
public enum InterventionLevel {
    
    /**
     * NORMAL Intervention
     * -------------------
     * Deficiency detected for 3 consecutive days.
     * 
     * When this triggers:
     * - A nutrient deficiency has been present for 3 days in a row
     * - This is the first level of intervention
     * 
     * What this means:
     * - The deficiency is consistent, not just a one-day thing
     * - User should start paying attention
     * - Not an emergency, but needs action
     * 
     * Actions taken:
     * - Display intervention alert on dashboard
     * - Show specific food recommendations
     * - Explain which nutrient is deficient and why it matters
     * - Suggest easy ways to improve intake
     * 
     * Example message:
     * "We've noticed you've been low on Vitamin C for 3 days.
     *  Try adding an orange or some strawberries to your meals!"
     * 
     * Color code in UI: Yellow/Orange
     * Email notification: No (not yet)
     */
    NORMAL,
    
    /**
     * ELEVATED Intervention
     * ---------------------
     * Deficiency persists for 5-6 consecutive days.
     * 
     * When this triggers:
     * - A NORMAL intervention wasn't resolved
     * - The deficiency has continued for 5-6 days
     * - User hasn't improved their intake
     * 
     * What this means:
     * - This is becoming a pattern
     * - More serious concern
     * - User may need more help or motivation
     * 
     * Actions taken:
     * - Display more prominent alert on dashboard
     * - Show detailed meal plans
     * - Provide educational information about health impacts
     * - Suggest specific recipes
     * - Consider sending email reminder
     * 
     * Example message:
     * "Your calcium intake has been low for 5 days.
     *  This is important for your growing bones!
     *  Here's a simple meal plan to help you get enough calcium..."
     * 
     * Color code in UI: Orange/Red
     * Email notification: Optional (depending on settings)
     */
    ELEVATED,
    
    /**
     * CRITICAL Intervention
     * ---------------------
     * Deficiency persists for 7+ consecutive days.
     * 
     * When this triggers:
     * - Deficiency has continued for a full week or more
     * - Previous interventions didn't help
     * - This is now a serious health concern
     * 
     * What this means:
     * - URGENT attention needed!
     * - May be affecting health and development
     * - User may need professional help (doctor, nutritionist)
     * - For children, parents/guardians should be notified
     * 
     * Actions taken:
     * - Display URGENT alert prominently on dashboard
     * - Send email notification immediately
     * - Provide detailed information about health risks
     * - Strongly recommend consulting healthcare provider
     * - For children: Suggest parent/guardian involvement
     * - Admin dashboard shows this user needs attention
     * 
     * Example message:
     * "URGENT: Your iron intake has been critically low for 7 days.
     *  This can cause fatigue, weakness, and affect your growth.
     *  We strongly recommend talking to a doctor or nutritionist.
     *  In the meantime, here are iron-rich foods to eat..."
     * 
     * Color code in UI: Red (danger)
     * Email notification: YES (sent within 1 hour)
     * 
     * Special notes:
     * - This level appears in admin dashboard for monitoring
     * - May require follow-up from healthcare professionals
     * - System tracks these carefully for safety
     */
    CRITICAL;
    
    // How the intervention system works:
    // 
    // Day 1-2: Deficiency detected
    //   → Show regular recommendations (no intervention yet)
    // 
    // Day 3: NORMAL intervention triggered
    //   → Display alert on dashboard
    //   → Show targeted recommendations
    // 
    // Day 5-6: Escalate to ELEVATED
    //   → More prominent alerts
    //   → Detailed meal plans
    //   → Consider email reminder
    // 
    // Day 7+: Escalate to CRITICAL
    //   → URGENT alerts
    //   → Send email notification
    //   → Recommend professional help
    //   → Flag for admin attention
    // 
    // If user improves their intake:
    //   → Intervention is marked as resolved
    //   → Congratulatory message shown
    //   → Continue monitoring
    // 
    // This graduated approach ensures we help users without being
    // too alarming for minor issues, but take serious action when needed!
}
