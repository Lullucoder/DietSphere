package com.nutrition.dietbalancetracker.controller;

import com.nutrition.dietbalancetracker.dto.ChartDataDTO;
import com.nutrition.dietbalancetracker.service.ChartDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * CHART DATA CONTROLLER
 * =====================
 * Serves pre-aggregated data shaped for Recharts on the frontend.
 */
@RestController
@RequestMapping("/api/charts")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ChartController {

    private final ChartDataService chartDataService;

    /**
     * GET /api/charts?userId=1&days=7
     * Returns all chart data for the requested period.
     */
    @GetMapping
    public ResponseEntity<ChartDataDTO> getChartData(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "7") int days) {
        days = Math.max(1, Math.min(days, 90)); // clamp 1..90
        return ResponseEntity.ok(chartDataService.getChartData(userId, days));
    }
}
