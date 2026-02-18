package com.nutrition.dietbalancetracker.controller;

import com.nutrition.dietbalancetracker.dto.LoginRequestDTO;
import com.nutrition.dietbalancetracker.dto.LoginResponseDTO;
import com.nutrition.dietbalancetracker.dto.UserRegistrationDTO;
import com.nutrition.dietbalancetracker.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AUTH CONTROLLER
 * ===============
 * Handles user registration and login endpoints.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {
    
    private final UserService userService;
    
    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<LoginResponseDTO> register(@Valid @RequestBody UserRegistrationDTO dto) {
        try {
            LoginResponseDTO response = userService.registerUser(dto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        try {
            LoginResponseDTO response = userService.loginUser(dto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
