package com.nutrition.dietbalancetracker.controller;

import com.nutrition.dietbalancetracker.dto.NutrientAnalysisDTO;
import com.nutrition.dietbalancetracker.service.NutrientAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * NUTRIENT ANALYSIS CONTROLLER
 * =============================
 * Provides endpoints for analyzing a user's nutrient intake
 * and generating deficiency reports with recommendations.
 */
@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class NutrientAnalysisController {

    private final NutrientAnalysisService nutrientAnalysisService;

    /**
     * GET /api/analysis/today?userId=1
     * Analyze today's nutrient intake.
     */
    @GetMapping("/today")
    public ResponseEntity<NutrientAnalysisDTO> analyzeToday(@RequestParam Long userId) {
        NutrientAnalysisDTO analysis = nutrientAnalysisService.analyzeToday(userId);
        return ResponseEntity.ok(analysis);
    }

    /**
     * GET /api/analysis/week?userId=1
     * Analyze the past 7 days (daily average).
     */
    @GetMapping("/week")
    public ResponseEntity<NutrientAnalysisDTO> analyzeWeek(@RequestParam Long userId) {
        NutrientAnalysisDTO analysis = nutrientAnalysisService.analyzeWeek(userId);
        return ResponseEntity.ok(analysis);
    }
}
