package com.nutrition.dietbalancetracker.controller;

import com.nutrition.dietbalancetracker.dto.DietaryEntryDTO;
import com.nutrition.dietbalancetracker.model.DietaryEntry;
import com.nutrition.dietbalancetracker.service.DietaryEntryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * DIETARY ENTRY CONTROLLER
 * =========================
 * Handles meal logging endpoints.
 */
@RestController
@RequestMapping("/api/entries")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class DietaryEntryController {
    
    private final DietaryEntryService dietaryEntryService;
    
    // POST /api/entries?userId=1
    @PostMapping
    public ResponseEntity<DietaryEntry> logMeal(
            @RequestParam Long userId,
            @Valid @RequestBody DietaryEntryDTO dto) {
        try {
            DietaryEntry entry = dietaryEntryService.logMeal(userId, dto);
            return ResponseEntity.ok(entry);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // GET /api/entries?userId=1
    @GetMapping
    public ResponseEntity<List<DietaryEntry>> getMealHistory(@RequestParam Long userId) {
        List<DietaryEntry> entries = dietaryEntryService.getMealHistory(userId);
        return ResponseEntity.ok(entries);
    }
    
    // GET /api/entries/today?userId=1
    @GetMapping("/today")
    public ResponseEntity<List<DietaryEntry>> getTodaysMeals(@RequestParam Long userId) {
        List<DietaryEntry> entries = dietaryEntryService.getTodaysMeals(userId);
        return ResponseEntity.ok(entries);
    }
}
