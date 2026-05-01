package com.nutrition.dietbalancetracker.repository;

import com.nutrition.dietbalancetracker.model.DietaryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DIETARY ENTRY REPOSITORY
 */
@Repository
public interface DietaryEntryRepository extends JpaRepository<DietaryEntry, Long> {
    
    // Find all entries for a user, sorted by consumed time (newest first)
    List<DietaryEntry> findByUserIdOrderByConsumedAtDesc(Long userId);
    
    // Find entries for a user within a date range
    List<DietaryEntry> findByUserIdAndConsumedAtBetweenOrderByConsumedAtDesc(
        Long userId, LocalDateTime start, LocalDateTime end);

    // Delete all dietary entries referencing any of the given food items
    void deleteByFoodItemIn(java.util.List<com.nutrition.dietbalancetracker.model.FoodItem> foodItems);

    // Count entries for a specific user (for admin stats)
    long countByUserId(Long userId);
}

