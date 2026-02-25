package com.nutrition.dietbalancetracker.controller;

import com.nutrition.dietbalancetracker.dto.FoodItemResponseDTO;
import com.nutrition.dietbalancetracker.service.FoodItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
    
    // GET /api/foods/search?query=apple
    @GetMapping("/search")
    public ResponseEntity<List<FoodItemResponseDTO>> searchFoods(
            @RequestParam(required = false) String query) {
        List<FoodItemResponseDTO> foods = foodItemService.searchFoods(query);
        return ResponseEntity.ok(foods);
    }
}
