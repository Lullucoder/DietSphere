package com.nutrition.dietbalancetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * LOGIN RESPONSE DTO
 * ==================
 * What we send back after successful login.
 */
@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private String username;
    private String email;
    private Long userId;
}
