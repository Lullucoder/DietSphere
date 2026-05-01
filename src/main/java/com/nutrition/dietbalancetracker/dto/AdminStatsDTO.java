package com.nutrition.dietbalancetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ADMIN STATS DTO
 * ================
 * System-wide statistics for the admin dashboard.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDTO {
    private long totalUsers;
    private long totalAdmins;
    private long totalDietaryEntries;
    private long totalFoodItems;
    private long newUsersToday;
    private long newUsersThisWeek;
    private double avgEntriesPerUser;
}
