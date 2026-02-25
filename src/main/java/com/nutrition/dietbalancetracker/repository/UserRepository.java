package com.nutrition.dietbalancetracker.repository;

import com.nutrition.dietbalancetracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

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
    
    // Find a user by email
    Optional<User> findByEmail(String email);
    
    // Check if username already exists
    boolean existsByUsername(String username);
    
    // Check if email already exists
    boolean existsByEmail(String email);
}
