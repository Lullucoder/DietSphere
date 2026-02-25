package com.nutrition.dietbalancetracker.model;

/**
 * USER ROLE ENUMERATION
 * ======================
 * This defines the different types of users in our system.
 * 
 * Think of this as "job titles" in our application.
 * Each user has exactly ONE role that determines what they can do.
 * 
 * Why use an enum instead of just strings?
 * - Prevents typos (can't accidentally write "UESR" instead of "USER")
 * - Makes code more readable
 * - Compiler checks that we only use valid roles
 * - Easy to add new roles in the future
 */
public enum UserRole {
    
    /**
     * USER Role
     * ---------
     * This is for regular users (children, adolescents, parents).
     * They can:
     * - Track their own dietary intake
     * - View their own nutrition analysis
     * - Get personalized recommendations
     * - See their own reports
     * 
     * They CANNOT:
     * - Access other users' data
     * - Modify the food database
     * - Change system settings
     */
    USER,
    
    /**
     * ADMIN Role
     * ----------
     * This is for administrators who manage the system.
     * They can:
     * - Do everything a USER can do
     * - Add/edit/delete food items in the database
     * - Configure nutrient thresholds
     * - View system-wide statistics
     * - See all users' data (for monitoring purposes)
     * - Export reports for all users
     * 
     * This role has more power, so it should only be given to trusted people!
     */
    ADMIN;
    
    // That's it! Just two simple roles.
    // When we create a user, we assign them one of these roles.
    // Spring Security will use this to control what they can access.
}
