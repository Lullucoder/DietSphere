package com.nutrition.dietbalancetracker.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

/**
 * USER REGISTRATION DTO
 * =====================
 * Data Transfer Object for user registration.
 * This is what the frontend sends when someone creates an account.
 */
@Data
public class UserRegistrationDTO {
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be 3-50 characters")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotNull(message = "Age is required")
    @Min(value = 1, message = "Age must be at least 1")
    @Max(value = 120, message = "Age must be less than 120")
    private Integer age;

    @NotNull(message = "Weight is required")
    @Min(value = 10, message = "Weight must be at least 10 kg")
    @Max(value = 300, message = "Weight must be less than 300 kg")
    private Double weightKg;

    @NotNull(message = "Height is required")
    @Min(value = 50, message = "Height must be at least 50 cm")
    @Max(value = 280, message = "Height must be less than 280 cm")
    private Double heightCm;
}
