package com.nutrition.dietbalancetracker.dto;

import java.time.LocalDateTime;

import lombok.Data;

/**
 * USER PROFILE DTO
 * =================
 * Sent to the frontend for the profile page.
 */
@Data
public class UserProfileDTO {
    private Long id;
    private String username;
    private String email;
    private Integer age;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
