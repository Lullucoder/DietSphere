package com.nutrition.dietbalancetracker.service;

import com.nutrition.dietbalancetracker.dto.FoodItemResponseDTO;
import com.nutrition.dietbalancetracker.model.FoodCategory;
import com.nutrition.dietbalancetracker.model.FoodItem;
import com.nutrition.dietbalancetracker.repository.FoodItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
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

    // Search foods by name and optionally filter by category
    public List<FoodItemResponseDTO> searchFoods(String query, String category) {
        List<FoodItem> foods;

        if (category != null && !category.trim().isEmpty()) {
            try {
                FoodCategory cat = FoodCategory.valueOf(category.toUpperCase());
                foods = foodItemRepository.findByCategoryAndIsActiveTrue(cat);
                if (query != null && !query.trim().isEmpty()) {
                    String q = query.toLowerCase();
                    foods = foods.stream()
                            .filter(f -> f.getName().toLowerCase().contains(q))
                            .collect(Collectors.toList());
                }
            } catch (IllegalArgumentException e) {
                foods = foodItemRepository.findByIsActiveTrue();
            }
        } else if (query == null || query.trim().isEmpty()) {
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
            var np = food.getNutrientProfile();
            dto.setCalories(np.getCalories());
            dto.setProtein(np.getProtein());
            dto.setCarbohydrates(np.getCarbohydrates());
            dto.setFat(np.getFat());

            FoodItemResponseDTO.NutrientProfileDTO npDTO = new FoodItemResponseDTO.NutrientProfileDTO();
            npDTO.setServingSize(np.getServingSize());
            npDTO.setCalories(np.getCalories());
            npDTO.setProtein(np.getProtein());
            npDTO.setCarbohydrates(np.getCarbohydrates());
            npDTO.setFat(np.getFat());
            npDTO.setFiber(np.getFiber());
            npDTO.setVitaminA(np.getVitaminA());
            npDTO.setVitaminC(np.getVitaminC());
            npDTO.setVitaminD(np.getVitaminD());
            npDTO.setVitaminE(np.getVitaminE());
            npDTO.setVitaminK(np.getVitaminK());
            npDTO.setVitaminB12(np.getVitaminB12());
            npDTO.setCalcium(np.getCalcium());
            npDTO.setIron(np.getIron());
            npDTO.setMagnesium(np.getMagnesium());
            npDTO.setZinc(np.getZinc());
            npDTO.setPotassium(np.getPotassium());
            dto.setNutrientProfile(npDTO);
        }
        
        return dto;
    }

    // Backward-compatible single-arg search
    public List<FoodItemResponseDTO> searchFoods(String query) {
        return searchFoods(query, null);
    }

    // Get category counts for the sidebar/tabs
    public List<Map<String, Object>> getCategoryCounts() {
        List<FoodItem> allActive = foodItemRepository.findByIsActiveTrue();
        Map<FoodCategory, Long> counts = allActive.stream()
                .collect(Collectors.groupingBy(FoodItem::getCategory, Collectors.counting()));

        List<Map<String, Object>> result = new ArrayList<>();
        for (FoodCategory cat : FoodCategory.values()) {
            long count = counts.getOrDefault(cat, 0L);
            if (count > 0) {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("category", cat.name());
                item.put("count", count);
                result.add(item);
            }
        }
        return result;
    }
}
