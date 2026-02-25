package com.nutrition.dietbalancetracker.model;

// These imports bring in JPA (database) functionality
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * USER ENTITY
 * ===========
 * This represents a user account in our system.
 * 
 * What is an entity?
 * - An entity is a Java class that maps to a database table
 * - Each instance (object) of this class = one row in the database
 * - Each field (variable) = one column in the database
 * 
 * Think of it like this:
 * - This class = Blueprint for a "users" table
 * - Each User object = One person's account
 * 
 * The @Entity annotation tells Spring: "Save this to the database!"
 */
@Entity  // This makes it a database table
@Table(name = "users")  // The table will be called "users"
@Data  // Lombok: Automatically creates getters, setters, toString, equals, hashCode
@NoArgsConstructor  // Lombok: Creates a constructor with no parameters
@AllArgsConstructor  // Lombok: Creates a constructor with all parameters
public class User {
    
    // ========================================
    // PRIMARY KEY (Unique Identifier)
    // ========================================
    
    /**
     * ID - The unique identifier for each user
     * 
     * What is an ID?
     * - Every user needs a unique number to identify them
     * - Like a student ID number or employee number
     * - The database automatically generates this number
     * 
     * @Id = This is the primary key
     * @GeneratedValue = Database automatically creates the number
     * IDENTITY strategy = Database handles the numbering (1, 2, 3, ...)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // ========================================
    // BASIC USER INFORMATION
    // ========================================
    
    /**
     * USERNAME - The name the user logs in with
     * 
     * Rules:
     * - Must be unique (no two users can have the same username)
     * - Cannot be null (empty)
     * - Used for logging in
     * 
     * Example: "john_doe", "sarah123"
     */
    @Column(unique = true, nullable = false, length = 50)
    private String username;
    
    /**
     * EMAIL - The user's email address
     * 
     * Rules:
     * - Must be unique (one email = one account)
     * - Cannot be null
     * - Used for login and notifications
     * 
     * Example: "john@example.com"
     */
    @Column(unique = true, nullable = false, length = 100)
    private String email;
    
    /**
     * PASSWORD HASH - The encrypted password
     * 
     * IMPORTANT: We NEVER store actual passwords!
     * - We store a "hash" (encrypted version)
     * - Even if someone steals the database, they can't see passwords
     * - We use BCrypt encryption (very secure!)
     * 
     * Example: 
     * - Real password: "myPassword123"
     * - Stored hash: "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
     * 
     * The hash is long and looks like random characters - that's good!
     */
    @Column(nullable = false)
    private String passwordHash;
    
    /**
     * ROLE - What type of user is this?
     * 
     * Two options:
     * - USER: Regular user (can track their own diet)
     * - ADMIN: Administrator (can manage the system)
     * 
     * This determines what features they can access.
     */
    @Enumerated(EnumType.STRING)  // Store as text ("USER" or "ADMIN") not numbers
    @Column(nullable = false, length = 20)
    private UserRole role;
    
    /**
     * AGE - How old is the user?
     * 
     * Why we need this:
     * - Different ages need different amounts of nutrients
     * - A 5-year-old needs less calcium than a 15-year-old
     * - We use this to calculate their age group
     * 
     * Must be between 1 and 120 years (validated in the service layer)
     */
    @Column(nullable = false)
    private Integer age;
    
    // ========================================
    // RELATIONSHIPS TO OTHER TABLES
    // ========================================
    
    /**
     * HEALTH DATA - The user's health information
     * 
     * Relationship type: One-to-One
     * - One user has exactly one health data record
     * - One health data record belongs to exactly one user
     * 
     * Think of it like:
     * - User = Person
     * - HealthData = Their medical file
     * - Each person has one medical file
     * 
     * mappedBy = "user" means the HealthData class has a "user" field
     * cascade = ALL means: if we delete a user, delete their health data too
     * orphanRemoval = true means: if health data loses its user, delete it
     */
    @JsonIgnore
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private HealthData healthData;
    
    /**
     * DIETARY ENTRIES - All the meals this user has logged
     * 
     * Relationship type: One-to-Many
     * - One user can have many dietary entries
     * - Each dietary entry belongs to one user
     * 
     * Think of it like:
     * - User = Person
     * - DietaryEntry = One meal they ate
     * - A person eats many meals
     * 
     * mappedBy = "user" means the DietaryEntry class has a "user" field
     * cascade = ALL means: if we delete a user, delete all their entries too
     * orphanRemoval = true means: if an entry loses its user, delete it
     * 
     * We initialize this as an empty ArrayList so it's never null
     */
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DietaryEntry> dietaryEntries = new ArrayList<>();
    
    // ========================================
    // TIMESTAMPS (When was this created/updated?)
    // ========================================
    
    /**
     * CREATED AT - When was this account created?
     * 
     * This is automatically set when the user registers.
     * We never change this - it's a permanent record of when they joined.
     * 
     * Example: "2024-02-18T10:30:00"
     */
    @Column(nullable = false, updatable = false)  // updatable=false means we can't change it later
    private LocalDateTime createdAt;
    
    /**
     * UPDATED AT - When was this account last modified?
     * 
     * This changes every time we update the user's information.
     * Helps us track when changes were made.
     * 
     * Example: "2024-02-20T15:45:00"
     */
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // ========================================
    // LIFECYCLE CALLBACKS
    // ========================================
    // These methods run automatically at certain times
    
    /**
     * BEFORE SAVING A NEW USER
     * 
     * This method runs automatically right before we save a new user to the database.
     * We use it to set the timestamps.
     * 
     * @PrePersist = Run this before saving for the first time
     */
    @PrePersist
    protected void onCreate() {
        // Set both timestamps to right now
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }
    
    /**
     * BEFORE UPDATING AN EXISTING USER
     * 
     * This method runs automatically right before we update an existing user.
     * We use it to update the "updatedAt" timestamp.
     * 
     * @PreUpdate = Run this before updating
     */
    @PreUpdate
    protected void onUpdate() {
        // Update the "last modified" timestamp
        this.updatedAt = LocalDateTime.now();
    }
    
    // ========================================
    // HELPER METHODS
    // ========================================
    
    /**
     * ADD A DIETARY ENTRY
     * 
     * This is a helper method to add a meal to this user's list.
     * It also sets the relationship in both directions (user ↔ entry).
     * 
     * Why do we need this?
     * - Keeps the relationship consistent
     * - Makes the code easier to use
     * - Prevents bugs from forgetting to set both sides
     * 
     * @param entry The meal to add
     */
    public void addDietaryEntry(DietaryEntry entry) {
        // Add the entry to our list
        dietaryEntries.add(entry);
        // Set this user as the owner of the entry
        entry.setUser(this);
    }
    
    /**
     * REMOVE A DIETARY ENTRY
     * 
     * This removes a meal from this user's list.
     * It also clears the relationship in both directions.
     * 
     * @param entry The meal to remove
     */
    public void removeDietaryEntry(DietaryEntry entry) {
        // Remove the entry from our list
        dietaryEntries.remove(entry);
        // Clear the user reference in the entry
        entry.setUser(null);
    }
}

/*
 * HOW THIS WORKS IN THE DATABASE:
 * ================================
 * 
 * When we save a User object, Spring creates a row in the "users" table:
 * 
 * +----+----------+------------------+-------------+------+-----+---------------------+---------------------+
 * | id | username | email            | password... | role | age | created_at          | updated_at          |
 * +----+----------+------------------+-------------+------+-----+---------------------+---------------------+
 * | 1  | john_doe | john@example.com | $2a$10$...  | USER | 15  | 2024-02-18 10:30:00 | 2024-02-18 10:30:00 |
 * | 2  | admin    | admin@system.com | $2a$10$...  | ADMIN| 30  | 2024-02-18 11:00:00 | 2024-02-18 11:00:00 |
 * +----+----------+------------------+-------------+------+-----+---------------------+---------------------+
 * 
 * Each row = one user account
 * Each column = one piece of information about that user
 * 
 * The relationships (healthData, dietaryEntries) are stored in separate tables
 * and linked by the user's ID (foreign key).
 */
