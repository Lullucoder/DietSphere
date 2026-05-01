package com.nutrition.dietbalancetracker.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nutrition.dietbalancetracker.model.User;
import com.nutrition.dietbalancetracker.model.UserRole;

/**
 * USER REPOSITORY
 * ===============
 * This interface talks to the database for User operations.
 * Spring automatically implements all these methods!
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find a user by username
    Optional<User> findByUsername(String username);

    // Find a user by username (case-insensitive)
    Optional<User> findByUsernameIgnoreCase(String username);
    
    // Find a user by email
    Optional<User> findByEmail(String email);

    // Find a user by email (case-insensitive)
    Optional<User> findByEmailIgnoreCase(String email);
    
    // Check if username already exists
    boolean existsByUsername(String username);
    
    // Check if email already exists
    boolean existsByEmail(String email);

    // Count users by role (for admin stats)
    long countByRole(UserRole role);

    // Find users created after a certain date (for admin stats)
    List<User> findByCreatedAtAfter(LocalDateTime date);
}

