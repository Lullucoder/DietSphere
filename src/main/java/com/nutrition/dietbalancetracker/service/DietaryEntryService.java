package com.nutrition.dietbalancetracker.service;

import com.nutrition.dietbalancetracker.dto.DietaryEntryDTO;
import com.nutrition.dietbalancetracker.model.DietaryEntry;
import com.nutrition.dietbalancetracker.model.FoodItem;
import com.nutrition.dietbalancetracker.model.User;
import com.nutrition.dietbalancetracker.repository.DietaryEntryRepository;
import com.nutrition.dietbalancetracker.repository.FoodItemRepository;
import com.nutrition.dietbalancetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DIETARY ENTRY SERVICE
 * =====================
 * Handles meal logging and history.
 */
@Service
@RequiredArgsConstructor
public class DietaryEntryService {
    
    private final DietaryEntryRepository dietaryEntryRepository;
    private final UserRepository userRepository;
    private final FoodItemRepository foodItemRepository;
    
    // Log a meal
    @Transactional
    public DietaryEntry logMeal(Long userId, DietaryEntryDTO dto) {
        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Find food item
        FoodItem foodItem = foodItemRepository.findById(dto.getFoodItemId())
                .orElseThrow(() -> new RuntimeException("Food item not found"));
        
        // Create entry
        DietaryEntry entry = new DietaryEntry();
        entry.setUser(user);
        entry.setFoodItem(foodItem);
        entry.setPortionSize(dto.getPortionSize());
        entry.setMealType(dto.getMealType());
        entry.setConsumedAt(dto.getConsumedAt() != null ? dto.getConsumedAt() : LocalDateTime.now());
        
        // Save and return
        return dietaryEntryRepository.save(entry);
    }
    
    // Get user's meal history
    public List<DietaryEntry> getMealHistory(Long userId) {
        return dietaryEntryRepository.findByUserIdOrderByConsumedAtDesc(userId);
    }
    
    // Get today's meals
    public List<DietaryEntry> getTodaysMeals(Long userId) {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        
        return dietaryEntryRepository.findByUserIdAndConsumedAtBetweenOrderByConsumedAtDesc(
                userId, startOfDay, endOfDay);
    }
}
