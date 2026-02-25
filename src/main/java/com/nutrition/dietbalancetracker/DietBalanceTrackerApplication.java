package com.nutrition.dietbalancetracker;

// These are imports - they bring in code from other files that we need to use
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * MAIN APPLICATION CLASS
 * ======================
 * This is the "starting point" of our entire application.
 * When you run this file, it starts up the whole Spring Boot application.
 * 
 * Think of this as the "ignition key" that starts the car (our application).
 * 
 * What happens when this runs:
 * 1. Spring Boot scans all our code files
 * 2. It sets up the database connection
 * 3. It starts the web server
 * 4. It makes our REST API endpoints available
 * 5. The application is ready to receive requests!
 */
@SpringBootApplication  // This magical annotation does A LOT:
                        // - Enables auto-configuration (Spring sets things up automatically)
                        // - Enables component scanning (finds all our @Controller, @Service, etc.)
                        // - Marks this as a Spring Boot application
public class DietBalanceTrackerApplication {

    /**
     * THE MAIN METHOD
     * ===============
     * This is where Java starts executing our program.
     * Every Java application needs a main method - it's the entry point.
     * 
     * @param args - Command line arguments (we don't use these, but Java requires this parameter)
     */
    public static void main(String[] args) {
        // This single line starts the entire Spring Boot application!
        // SpringApplication.run() does all the heavy lifting:
        // - Reads our configuration files
        // - Sets up the database
        // - Starts the embedded web server (Tomcat)
        // - Initializes all our components
        // - Makes the application ready to handle requests
        SpringApplication.run(DietBalanceTrackerApplication.class, args);
        
        // Once this runs successfully, you'll see logs in the console saying:
        // "Started DietBalanceTrackerApplication in X seconds"
        // That means our app is running and ready!
    }
    
    // That's it! This simple class is all we need to start our application.
    // The real magic happens in the other classes we'll create (controllers, services, etc.)
}
