package com.nutrition.dietbalancetracker.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nutrition.dietbalancetracker.dto.AdminStatsDTO;
import com.nutrition.dietbalancetracker.dto.AdminUserDTO;
import com.nutrition.dietbalancetracker.dto.AdminUserDetailDTO;
import com.nutrition.dietbalancetracker.service.AdminService;

import lombok.RequiredArgsConstructor;

/**
 * ADMIN CONTROLLER
 * =================
 * REST API endpoints for the admin dashboard.
 * All endpoints are protected by ADMIN role via SecurityConfig.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    /**
     * GET /api/admin/stats
     * Returns system-wide statistics for the dashboard overview cards.
     */
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getStats() {
        return ResponseEntity.ok(adminService.getSystemStats());
    }

    /**
     * GET /api/admin/users
     * Returns all users with summary info for the users table.
     */
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    /**
     * GET /api/admin/users/{userId}
     * Returns detailed info for a single user.
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<AdminUserDetailDTO> getUserDetail(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(adminService.getUserDetail(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * PUT /api/admin/users/{userId}/role
     * Update a user's role. Body: { "role": "ADMIN" } or { "role": "USER" }
     */
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {
        try {
            String role = body.get("role");
            if (role == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Role is required"));
            }
            AdminUserDTO updated = adminService.updateUserRole(userId, role);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid role. Use USER or ADMIN"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * DELETE /api/admin/users/{userId}
     * Delete a user account and all their data.
     */
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long userId) {
        try {
            adminService.deleteUser(userId);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
