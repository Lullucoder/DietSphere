package com.nutrition.dietbalancetracker.service;

import com.nutrition.dietbalancetracker.dto.FoodItemResponseDTO;
import com.nutrition.dietbalancetracker.model.FoodItem;
import com.nutrition.dietbalancetracker.repository.FoodItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/**
 * FOOD ITEM SERVICE
 * =================
 * Handles food search and retrieval.
 */
@Service
@RequiredArgsConstructor
public class FoodItemService {
    
    private final FoodItemRepository foodItemRepository;
    
    // Search foods by name
    public List<FoodItemResponseDTO> searchFoods(String query) {
        List<FoodItem> foods;
        
        if (query == null || query.trim().isEmpty()) {
            // If no query, return all active foods
            foods = foodItemRepository.findByIsActiveTrue();
        } else {
            // Search by name
            foods = foodItemRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(query);
        }
        
        // Convert to DTOs
        return foods.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Convert FoodItem to DTO
    private FoodItemResponseDTO convertToDTO(FoodItem food) {
        FoodItemResponseDTO dto = new FoodItemResponseDTO();
        dto.setId(food.getId());
        dto.setName(food.getName());
        dto.setDescription(food.getDescription());
        dto.setCategory(food.getCategory());
        
        // Add nutrient info if available
        if (food.getNutrientProfile() != null) {
            dto.setCalories(food.getNutrientProfile().getCalories());
            dto.setProtein(food.getNutrientProfile().getProtein());
            dto.setCarbohydrates(food.getNutrientProfile().getCarbohydrates());
            dto.setFat(food.getNutrientProfile().getFat());
        }
        
        return dto;
    }
}
