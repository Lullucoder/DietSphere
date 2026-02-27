package com.nutrition.dietbalancetracker.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nutrition.dietbalancetracker.dto.LoginRequestDTO;
import com.nutrition.dietbalancetracker.dto.LoginResponseDTO;
import com.nutrition.dietbalancetracker.dto.PasswordChangeDTO;
import com.nutrition.dietbalancetracker.dto.UserProfileDTO;
import com.nutrition.dietbalancetracker.dto.UserRegistrationDTO;
import com.nutrition.dietbalancetracker.model.User;
import com.nutrition.dietbalancetracker.repository.DietaryEntryRepository;
import com.nutrition.dietbalancetracker.repository.NutritionGoalRepository;
import com.nutrition.dietbalancetracker.repository.UserRepository;
import com.nutrition.dietbalancetracker.service.UserService;

import jakarta.validation.Valid;

/**
 * AUTH CONTROLLER
 * ===============
 * Handles user registration, login, and profile management endpoints.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DietaryEntryRepository dietaryEntryRepository;
    private final NutritionGoalRepository nutritionGoalRepository;

    public AuthController(
            UserService userService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            DietaryEntryRepository dietaryEntryRepository,
            NutritionGoalRepository nutritionGoalRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.dietaryEntryRepository = dietaryEntryRepository;
        this.nutritionGoalRepository = nutritionGoalRepository;
    }
    
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
                    if (updates.containsKey("weightKg")) {
                        user.setWeightKg(((Number) updates.get("weightKg")).doubleValue());
                    }
                    if (updates.containsKey("heightCm")) {
                        user.setHeightCm(((Number) updates.get("heightCm")).doubleValue());
                    }
                    User saved = userRepository.save(user);
                    return ResponseEntity.ok(toProfileDTO(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/auth/change-password?userId=1
    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @RequestParam Long userId,
            @Valid @RequestBody PasswordChangeDTO dto) {
        return userRepository.findById(userId)
                .map(user -> {
                    if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPasswordHash())) {
                        return ResponseEntity.badRequest()
                                .body(Map.of("message", "Current password is incorrect"));
                    }
                    user.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
                    userRepository.save(user);
                    return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/auth/account?userId=1
    @DeleteMapping("/account")
    @Transactional
    public ResponseEntity<Map<String, String>> deleteAccount(
            @RequestParam Long userId,
            @RequestBody Map<String, String> body) {
        return userRepository.findById(userId)
                .map(user -> {
                    String password = body.get("password");
                    if (password == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
                        return ResponseEntity.badRequest()
                                .body(Map.of("message", "Password is incorrect"));
                    }
                    // Delete related data first
                    nutritionGoalRepository.deleteByUserId(userId);
                    dietaryEntryRepository.deleteAll(user.getDietaryEntries());
                    userRepository.delete(user);
                    return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
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
        dto.setWeightKg(user.getWeightKg());
        dto.setHeightCm(user.getHeightCm());
        dto.setBmi(user.getBmi());
        dto.setBmiCategory(user.getBmiCategory());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}
