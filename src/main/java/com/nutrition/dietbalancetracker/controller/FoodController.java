package com.nutrition.dietbalancetracker.controller;

import com.nutrition.dietbalancetracker.dto.FoodItemResponseDTO;
import com.nutrition.dietbalancetracker.service.FoodItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * FOOD CONTROLLER
 * ===============
 * Handles food search endpoints.
 */
@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class FoodController {
    
    private final FoodItemService foodItemService;
    
    // GET /api/foods/search?query=apple&category=GRAIN
    @GetMapping("/search")
    public ResponseEntity<List<FoodItemResponseDTO>> searchFoods(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category) {
        List<FoodItemResponseDTO> foods = foodItemService.searchFoods(query, category);
        return ResponseEntity.ok(foods);
    }

    // GET /api/foods/categories — returns [{category: "GRAIN", count: 15}, ...]
    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, Object>>> getCategories() {
        return ResponseEntity.ok(foodItemService.getCategoryCounts());
    }
}
