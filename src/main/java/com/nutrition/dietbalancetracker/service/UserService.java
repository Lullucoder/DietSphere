package com.nutrition.dietbalancetracker.service;

import com.nutrition.dietbalancetracker.dto.LoginRequestDTO;
import com.nutrition.dietbalancetracker.dto.LoginResponseDTO;
import com.nutrition.dietbalancetracker.dto.UserRegistrationDTO;
import com.nutrition.dietbalancetracker.model.User;
import com.nutrition.dietbalancetracker.model.UserRole;
import com.nutrition.dietbalancetracker.repository.UserRepository;
import com.nutrition.dietbalancetracker.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * USER SERVICE
 * ============
 * Handles user registration and login logic.
 */
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    
    // Register a new user
    @Transactional
    public LoginResponseDTO registerUser(UserRegistrationDTO dto) {
        // Check if username already exists
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Create new user
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setAge(dto.getAge());
        user.setWeightKg(dto.getWeightKg());
        user.setHeightCm(dto.getHeightCm());
        user.setRole(UserRole.USER);
        
        // Save to database
        user = userRepository.save(user);
        
        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getUsername());
        
        // Return response
        return new LoginResponseDTO(token, user.getUsername(), user.getEmail(), user.getId(),
                user.getBmi(), user.getBmiCategory());
    }
    
    // Login user
    public LoginResponseDTO loginUser(LoginRequestDTO dto) {
        // Find user by username
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));
        
        // Check password
        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid username or password");
        }
        
        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getUsername());
        
        // Return response
        return new LoginResponseDTO(token, user.getUsername(), user.getEmail(), user.getId(),
                user.getBmi(), user.getBmiCategory());
    }
}
