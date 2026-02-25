package com.nutrition.dietbalancetracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * PASSWORD CHANGE DTO
 * ===================
 * Sent by the frontend when the user changes their password.
 */
@Data
public class PasswordChangeDTO {

    @NotBlank(message = "Current password is required")
    private String currentPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 6, message = "New password must be at least 6 characters")
    private String newPassword;
}
