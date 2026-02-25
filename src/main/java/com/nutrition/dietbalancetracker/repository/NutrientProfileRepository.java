package com.nutrition.dietbalancetracker.repository;

import com.nutrition.dietbalancetracker.model.NutrientProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * NUTRIENT PROFILE REPOSITORY
 */
@Repository
public interface NutrientProfileRepository extends JpaRepository<NutrientProfile, Long> {
    
    // Find nutrient profile by food item ID
    Optional<NutrientProfile> findByFoodItemId(Long foodItemId);
}
