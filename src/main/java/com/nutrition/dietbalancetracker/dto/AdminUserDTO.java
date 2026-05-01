package com.nutrition.dietbalancetracker.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ADMIN USER DTO
 * ===============
 * User summary for the admin users table.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDTO {
    private Long id;
    private String username;
    private String email;
    private Integer age;
    private String role;
    private Double weightKg;
    private Double heightCm;
    private Double bmi;
    private String bmiCategory;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long totalDietaryEntries;
}
