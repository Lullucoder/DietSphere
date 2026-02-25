package com.nutrition.dietbalancetracker.repository;

import com.nutrition.dietbalancetracker.model.NutritionGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * NUTRITION GOAL REPOSITORY
 */
@Repository
public interface NutritionGoalRepository extends JpaRepository<NutritionGoal, Long> {

    Optional<NutritionGoal> findByUserId(Long userId);

    void deleteByUserId(Long userId);
}
