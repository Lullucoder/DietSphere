package com.nutrition.dietbalancetracker.controller;

// These imports bring in Spring's web functionality
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * HEALTH CHECK CONTROLLER
 * ========================
 * This is a simple controller to test if our application is running.
 * 
 * What is a controller?
 * - It's like a "receptionist" for our application
 * - It receives HTTP requests from the outside world
 * - It processes them and sends back responses
 * 
 * This specific controller just tells us "Yes, I'm alive and working!"
 * It's useful for testing and monitoring.
 */
@RestController  // This tells Spring: "This class handles web requests"
@RequestMapping("/api")  // All endpoints in this class start with "/api"
public class HealthCheckController {
    
    /**
     * HEALTH CHECK ENDPOINT
     * =====================
     * This is the simplest possible endpoint - it just says "Hello, I'm working!"
     * 
     * How to test it:
     * 1. Start the application
     * 2. Open your browser
     * 3. Go to: http://localhost:8080/api/health
     * 4. You should see a JSON response with status and timestamp
     * 
     * @return A response with status information
     */
    @GetMapping("/health")  // This means: respond to GET requests at "/api/health"
    public ResponseEntity<Map<String, Object>> healthCheck() {
        // Create a map to hold our response data
        // Think of a map like a dictionary - it has keys and values
        Map<String, Object> response = new HashMap<>();
        
        // Add information to our response
        response.put("status", "UP");  // Application is running
        response.put("message", "Diet Balance Tracker is running successfully!");
        response.put("timestamp", LocalDateTime.now().toString());  // Current time
        response.put("version", "1.0.0");  // Our app version
        
        // Send back the response with HTTP status 200 (OK)
        return ResponseEntity.ok(response);
    }
    
    /**
     * WELCOME ENDPOINT
     * ================
     * A friendly welcome message for anyone visiting our API.
     * 
     * How to test it:
     * Go to: http://localhost:8080/api/welcome
     * 
     * @return A welcome message
     */
    @GetMapping("/welcome")
    public ResponseEntity<Map<String, String>> welcome() {
        Map<String, String> response = new HashMap<>();
        
        response.put("message", "Welcome to Diet Balance Nutrient Tracker API!");
        response.put("description", "Track your nutrition and stay healthy!");
        response.put("documentation", "Visit /api/health to check system status");
        
        return ResponseEntity.ok(response);
    }
}
