package com.nutrition.dietbalancetracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nutrition.dietbalancetracker.dto.NutritionGoalDTO;
import com.nutrition.dietbalancetracker.model.NutritionGoal;
import com.nutrition.dietbalancetracker.model.User;
import com.nutrition.dietbalancetracker.repository.NutritionGoalRepository;
import com.nutrition.dietbalancetracker.repository.UserRepository;

/**
 * GOAL CONTROLLER
 * ===============
 * GET  /api/goals?userId=1   → fetch goals (returns defaults if none set)
 * PUT  /api/goals?userId=1   → create / update goals
 */
@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final NutritionGoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalController(NutritionGoalRepository goalRepository, UserRepository userRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<NutritionGoalDTO> getGoals(@RequestParam Long userId) {
        NutritionGoalDTO dto = goalRepository.findByUserId(userId)
                .map(this::toDTO)
                .orElseGet(this::defaults);
        return ResponseEntity.ok(dto);
    }

    @PutMapping
    public ResponseEntity<NutritionGoalDTO> saveGoals(
            @RequestParam Long userId,
            @RequestBody NutritionGoalDTO dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        NutritionGoal goal = goalRepository.findByUserId(userId)
                .orElseGet(() -> {
                    NutritionGoal g = new NutritionGoal();
                    g.setUser(user);
                    return g;
                });

        if (dto.getCalorieGoal() != null) goal.setCalorieGoal(dto.getCalorieGoal());
        if (dto.getProteinGoal() != null) goal.setProteinGoal(dto.getProteinGoal());
        if (dto.getCarbsGoal() != null) goal.setCarbsGoal(dto.getCarbsGoal());
        if (dto.getFatGoal() != null) goal.setFatGoal(dto.getFatGoal());
        if (dto.getFiberGoal() != null) goal.setFiberGoal(dto.getFiberGoal());

        goal = goalRepository.save(goal);
        return ResponseEntity.ok(toDTO(goal));
    }

    private NutritionGoalDTO toDTO(NutritionGoal g) {
        NutritionGoalDTO d = new NutritionGoalDTO();
        d.setCalorieGoal(g.getCalorieGoal());
        d.setProteinGoal(g.getProteinGoal());
        d.setCarbsGoal(g.getCarbsGoal());
        d.setFatGoal(g.getFatGoal());
        d.setFiberGoal(g.getFiberGoal());
        return d;
    }

    private NutritionGoalDTO defaults() {
        NutritionGoalDTO d = new NutritionGoalDTO();
        d.setCalorieGoal(2000);
        d.setProteinGoal(50);
        d.setCarbsGoal(300);
        d.setFatGoal(65);
        d.setFiberGoal(25);
        return d;
    }
}
