package com.nutrition.dietbalancetracker.controller;

import com.nutrition.dietbalancetracker.dto.LoginRequestDTO;
import com.nutrition.dietbalancetracker.dto.LoginResponseDTO;
import com.nutrition.dietbalancetracker.dto.UserProfileDTO;
import com.nutrition.dietbalancetracker.dto.UserRegistrationDTO;
import com.nutrition.dietbalancetracker.model.User;
import com.nutrition.dietbalancetracker.repository.UserRepository;
import com.nutrition.dietbalancetracker.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AUTH CONTROLLER
 * ===============
 * Handles user registration, login, and profile management endpoints.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {
    
    private final UserService userService;
    private final UserRepository userRepository;
    
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

    // GET /api/auth/profile?userId=1
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getProfile(@RequestParam Long userId) {
        return userRepository.findById(userId)
                .map(user -> {
                    UserProfileDTO profile = toProfileDTO(user);
                    return ResponseEntity.ok(profile);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/auth/profile?userId=1
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(
            @RequestParam Long userId,
            @RequestBody Map<String, Object> updates) {
        return userRepository.findById(userId)
                .map(user -> {
                    if (updates.containsKey("email")) {
                        user.setEmail((String) updates.get("email"));
                    }
                    if (updates.containsKey("age")) {
                        user.setAge(((Number) updates.get("age")).intValue());
                    }
                    User saved = userRepository.save(user);
                    return ResponseEntity.ok(toProfileDTO(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private UserProfileDTO toProfileDTO(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setAge(user.getAge());
        dto.setRole(user.getRole().name());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}
