package com.nutrition.dietbalancetracker.repository;

import com.nutrition.dietbalancetracker.model.FoodItem;
import com.nutrition.dietbalancetracker.model.FoodCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * FOOD ITEM REPOSITORY
 */
@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    
    // Search foods by name (case-insensitive, partial match)
    List<FoodItem> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
    
    // Find all active foods
    List<FoodItem> findByIsActiveTrue();
    
    // Find foods by category
    List<FoodItem> findByCategoryAndIsActiveTrue(FoodCategory category);
}
