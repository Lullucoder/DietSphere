package com.nutrition.dietbalancetracker.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * LOGIN REQUEST DTO
 * =================
 * Data for user login (username or email).
 */
@Data
public class LoginRequestDTO {
    
     @NotBlank(message = "Username or email is required")
     @JsonAlias({"email", "identifier"})
    private String username;
    
    @NotBlank(message = "Password is required")
    private String password;
}
