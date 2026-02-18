package com.nutrition.dietbalancetracker.repository;

import com.nutrition.dietbalancetracker.model.HealthData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * HEALTH DATA REPOSITORY
 */
@Repository
public interface HealthDataRepository extends JpaRepository<HealthData, Long> {
    
    // Find health data by user ID
    Optional<HealthData> findByUserId(Long userId);
}
