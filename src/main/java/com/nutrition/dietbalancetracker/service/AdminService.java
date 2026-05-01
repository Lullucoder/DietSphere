package com.nutrition.dietbalancetracker.service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nutrition.dietbalancetracker.dto.AdminStatsDTO;
import com.nutrition.dietbalancetracker.dto.AdminUserDTO;
import com.nutrition.dietbalancetracker.dto.AdminUserDetailDTO;
import com.nutrition.dietbalancetracker.model.DietaryEntry;
import com.nutrition.dietbalancetracker.model.NutritionGoal;
import com.nutrition.dietbalancetracker.model.User;
import com.nutrition.dietbalancetracker.model.UserRole;
import com.nutrition.dietbalancetracker.repository.DietaryEntryRepository;
import com.nutrition.dietbalancetracker.repository.FoodItemRepository;
import com.nutrition.dietbalancetracker.repository.NutritionGoalRepository;
import com.nutrition.dietbalancetracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * ADMIN SERVICE
 * ==============
 * Business logic for admin dashboard operations.
 */
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final DietaryEntryRepository dietaryEntryRepository;
    private final FoodItemRepository foodItemRepository;
    private final NutritionGoalRepository nutritionGoalRepository;

    /**
     * Get system-wide statistics for the admin dashboard.
     */
    public AdminStatsDTO getSystemStats() {
        long totalUsers = userRepository.count();
        long totalAdmins = userRepository.countByRole(UserRole.ADMIN);
        long totalEntries = dietaryEntryRepository.count();
        long totalFoodItems = foodItemRepository.count();

        // Users created today
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        long newUsersToday = userRepository.findByCreatedAtAfter(startOfDay).size();

        // Users created this week
        LocalDateTime startOfWeek = LocalDateTime.now().minusDays(7).with(LocalTime.MIN);
        long newUsersThisWeek = userRepository.findByCreatedAtAfter(startOfWeek).size();

        // Average entries per user
        double avgEntries = totalUsers > 0 ? (double) totalEntries / totalUsers : 0;
        avgEntries = Math.round(avgEntries * 10.0) / 10.0;

        return new AdminStatsDTO(totalUsers, totalAdmins, totalEntries,
                totalFoodItems, newUsersToday, newUsersThisWeek, avgEntries);
    }

    /**
     * Get all users with summary info for the admin users table.
     */
    public List<AdminUserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toAdminUserDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get detailed info for a single user (profile + entries + goals).
     */
    public AdminUserDetailDTO getUserDetail(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AdminUserDetailDTO dto = new AdminUserDetailDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setAge(user.getAge());
        dto.setRole(user.getRole().name());
        dto.setWeightKg(user.getWeightKg());
        dto.setHeightCm(user.getHeightCm());
        dto.setBmi(user.getBmi());
        dto.setBmiCategory(user.getBmiCategory());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        dto.setTotalDietaryEntries(dietaryEntryRepository.countByUserId(userId));

        // Nutrition goals
        NutritionGoal goal = nutritionGoalRepository.findByUserId(userId).orElse(null);
        if (goal != null) {
            dto.setCalorieGoal(goal.getCalorieGoal());
            dto.setProteinGoal(goal.getProteinGoal());
            dto.setCarbsGoal(goal.getCarbsGoal());
            dto.setFatGoal(goal.getFatGoal());
            dto.setFiberGoal(goal.getFiberGoal());
        }

        // Recent dietary entries (last 20)
        List<DietaryEntry> entries = dietaryEntryRepository.findByUserIdOrderByConsumedAtDesc(userId);
        List<AdminUserDetailDTO.DietaryEntryDetail> entryDetails = entries.stream()
                .limit(20)
                .map(e -> new AdminUserDetailDTO.DietaryEntryDetail(
                        e.getId(),
                        e.getFoodItem() != null ? e.getFoodItem().getName() : "Unknown",
                        e.getMealType().name(),
                        e.getPortionSize(),
                        e.getConsumedAt()
                ))
                .collect(Collectors.toList());
        dto.setRecentEntries(entryDetails);

        return dto;
    }

    /**
     * Update a user's role (promote/demote).
     */
    @Transactional
    public AdminUserDTO updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserRole newRole = UserRole.valueOf(roleName.toUpperCase());
        user.setRole(newRole);
        user = userRepository.save(user);

        return toAdminUserDTO(user);
    }

    /**
     * Delete a user and all their related data.
     */
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete related data
        nutritionGoalRepository.findByUserId(userId)
                .ifPresent(goal -> nutritionGoalRepository.delete(goal));

        // Delete user (cascades to dietary entries and health data)
        userRepository.delete(user);
    }

    private AdminUserDTO toAdminUserDTO(User user) {
        return new AdminUserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getAge(),
                user.getRole().name(),
                user.getWeightKg(),
                user.getHeightCm(),
                user.getBmi(),
                user.getBmiCategory(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                dietaryEntryRepository.countByUserId(user.getId())
        );
    }
}
