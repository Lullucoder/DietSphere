package com.nutrition.dietbalancetracker.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

/**
 * LOGIN REQUEST DTO
 * =================
 * Data for user login.
 */
@Data
public class LoginRequestDTO {
    
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotBlank(message = "Password is required")
    private String password;
}
