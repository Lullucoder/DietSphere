package com.nutrition.dietbalancetracker.controller;

import com.nutrition.dietbalancetracker.dto.DietaryEntryDTO;
import com.nutrition.dietbalancetracker.dto.DietaryEntryResponseDTO;
import com.nutrition.dietbalancetracker.dto.FoodItemResponseDTO;
import com.nutrition.dietbalancetracker.model.DietaryEntry;
import com.nutrition.dietbalancetracker.model.FoodItem;
import com.nutrition.dietbalancetracker.model.NutrientProfile;
import com.nutrition.dietbalancetracker.service.DietaryEntryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DIETARY ENTRY CONTROLLER
 * =========================
 * Handles meal logging, history, and deletion endpoints.
 */
@RestController
@RequestMapping("/api/entries")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class DietaryEntryController {
    
    private final DietaryEntryService dietaryEntryService;
    
    // POST /api/entries?userId=1
    @PostMapping
    public ResponseEntity<DietaryEntryResponseDTO> logMeal(
            @RequestParam Long userId,
            @Valid @RequestBody DietaryEntryDTO dto) {
        try {
            DietaryEntry entry = dietaryEntryService.logMeal(userId, dto);
            return ResponseEntity.ok(toResponseDTO(entry));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // GET /api/entries?userId=1
    @GetMapping
    public ResponseEntity<List<DietaryEntryResponseDTO>> getMealHistory(@RequestParam Long userId) {
        List<DietaryEntry> entries = dietaryEntryService.getMealHistory(userId);
        List<DietaryEntryResponseDTO> dtos = entries.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    // GET /api/entries/today?userId=1
    @GetMapping("/today")
    public ResponseEntity<List<DietaryEntryResponseDTO>> getTodaysMeals(@RequestParam Long userId) {
        List<DietaryEntry> entries = dietaryEntryService.getTodaysMeals(userId);
        List<DietaryEntryResponseDTO> dtos = entries.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // DELETE /api/entries/{id}?userId=1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(
            @PathVariable Long id,
            @RequestParam Long userId) {
        try {
            dietaryEntryService.deleteEntry(id, userId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Convert a DietaryEntry entity to a response DTO
     * to prevent circular JSON serialization.
     */
    private DietaryEntryResponseDTO toResponseDTO(DietaryEntry entry) {
        DietaryEntryResponseDTO dto = new DietaryEntryResponseDTO();
        dto.setId(entry.getId());
        dto.setUserId(entry.getUser() != null ? entry.getUser().getId() : null);
        dto.setPortionSize(entry.getPortionSize());
        dto.setConsumedAt(entry.getConsumedAt());
        dto.setMealType(entry.getMealType());
        dto.setCreatedAt(entry.getCreatedAt());

        if (entry.getFoodItem() != null) {
            FoodItem food = entry.getFoodItem();
            FoodItemResponseDTO foodDTO = new FoodItemResponseDTO();
            foodDTO.setId(food.getId());
            foodDTO.setName(food.getName());
            foodDTO.setDescription(food.getDescription());
            foodDTO.setCategory(food.getCategory());

            if (food.getNutrientProfile() != null) {
                NutrientProfile np = food.getNutrientProfile();
                foodDTO.setCalories(np.getCalories());
                foodDTO.setProtein(np.getProtein());
                foodDTO.setCarbohydrates(np.getCarbohydrates());
                foodDTO.setFat(np.getFat());

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
                foodDTO.setNutrientProfile(npDTO);
            }
            dto.setFoodItem(foodDTO);
        }
        return dto;
    }
}
