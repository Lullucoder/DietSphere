# Design Document: Diet Balance Nutrient Tracker

## Overview

The Diet Balance Nutrient Tracker is a full-stack web application built with Java Spring Boot backend and a modern frontend framework. The system follows a layered architecture pattern with clear separation between presentation, business logic, and data access layers. The design emphasizes clean, educational code suitable for prototype demonstrations while maintaining production-quality security and data handling practices.

The application serves two primary user types: end users (children, adolescents, and their guardians) who track dietary habits and receive recommendations, and administrators who manage nutritional data and system configuration. The core functionality revolves around nutrient analysis algorithms that detect deficiencies and generate personalized dietary recommendations.

## Architecture

### High-Level Architecture

The system follows a three-tier architecture:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (React Frontend - Modern UI)         │
└─────────────────┬───────────────────────┘
                  │ REST API (JSON)
┌─────────────────▼───────────────────────┐
│         Application Layer               │
│    (Spring Boot - Business Logic)       │
│  ┌──────────────────────────────────┐   │
│  │  Controllers                     │   │
│  │  Services (Business Logic)       │   │
│  │  Security (Spring Security)      │   │
│  └──────────────────────────────────┘   │
└─────────────────┬───────────────────────┘
                  │ JPA/Hibernate
┌─────────────────▼───────────────────────┐
│         Data Layer                      │
│  (PostgreSQL/MySQL Database)            │
│  - User Data                            │
│  - Dietary Entries                      │
│  - Nutritional Database                 │
│  - Configuration                        │
└─────────────────────────────────────────┘
```

### Technology Stack

**Backend:**
- Java 17+ with Spring Boot 3.x
- Spring Data JPA for data access
- Spring Security for authentication/authorization
- Spring Validation for input validation
- PostgreSQL or MySQL for relational database
- BCrypt for password hashing
- JWT for stateless authentication

**Frontend:**
- React with JavaScript (using Vite)
- Axios for HTTP requests
- Chart.js or D3.js for data visualization
- Responsive CSS framework (Bootstrap or Tailwind CSS)

**Development:**
- Eclipse IDE for backend development
- Maven for dependency management
- JUnit 5 and Mockito for testing

## Components and Interfaces

### Backend Components

#### 1. Authentication and Authorization Module

**UserController**
```java
@RestController
@RequestMapping("/api/auth")
public class UserController {
    POST /register - Register new user
    POST /login - Authenticate user and return JWT token
    POST /logout - Invalidate user session
    GET /profile - Get current user profile
    PUT /profile - Update user profile
}
```

**UserService**
- `registerUser(UserRegistrationDTO): User` - Validates and creates new user account
- `authenticateUser(String username, String password): AuthenticationToken` - Verifies credentials
- `updateUserProfile(Long userId, UserProfileDTO): User` - Updates user information
- `deleteUserAccount(Long userId): void` - Permanently removes user data

**SecurityConfig**
- Configures Spring Security with JWT authentication
- Defines role-based access control (ROLE_USER, ROLE_ADMIN)
- Enforces HTTPS and CORS policies

#### 2. Dietary Entry Module

**DietaryEntryController**
```java
@RestController
@RequestMapping("/api/dietary-entries")
public class DietaryEntryController {
    POST / - Create new dietary entry
    GET / - Get user's dietary entries (with date filtering)
    GET /{id} - Get specific dietary entry
    PUT /{id} - Update dietary entry
    DELETE /{id} - Delete dietary entry
}
```

**DietaryEntryService**
- `createEntry(Long userId, DietaryEntryDTO): DietaryEntry` - Creates and persists dietary entry
- `getUserEntries(Long userId, LocalDate startDate, LocalDate endDate): List<DietaryEntry>` - Retrieves entries for date range
- `updateEntry(Long entryId, DietaryEntryDTO): DietaryEntry` - Modifies existing entry
- `deleteEntry(Long entryId): void` - Removes dietary entry

**FoodItemService**
- `searchFoodItems(String query): List<FoodItem>` - Searches food database
- `getFoodItemById(Long id): FoodItem` - Retrieves specific food item with nutrient profile
- `createCustomFoodItem(Long userId, CustomFoodDTO): FoodItem` - Creates user-defined food item

#### 3. Nutrient Analysis Module

**NutrientAnalysisController**
```java
@RestController
@RequestMapping("/api/analysis")
public class NutrientAnalysisController {
    GET /current - Get current nutrient analysis for user
    GET /history - Get historical nutrient trends
    POST /calculate - Trigger nutrient analysis calculation
}
```

**NutrientAnalysisService**
- `calculateNutrientIntake(Long userId, LocalDate startDate, LocalDate endDate): NutrientAnalysis` - Aggregates nutrient totals
- `detectDeficiencies(NutrientAnalysis analysis, HealthData healthData): List<NutrientDeficiency>` - Compares against thresholds
- `getNutrientTrends(Long userId, int days): Map<Nutrient, List<DailyIntake>>` - Calculates historical trends

**NutrientCalculator** (Utility Component)
- `calculateDailyRequirements(HealthData healthData): Map<Nutrient, Double>` - Determines age/weight-based requirements
- `aggregateNutrients(List<DietaryEntry> entries): Map<Nutrient, Double>` - Sums nutrient values
- `calculateDeficiencyPercentage(double actual, double required): double` - Computes deficiency level

#### 4. Recommendation Engine Module

**RecommendationController**
```java
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    GET / - Get current recommendations for user
    POST /refresh - Force recommendation regeneration
    PUT /{id}/acknowledge - Mark recommendation as viewed
}
```

**RecommendationService**
- `generateRecommendations(Long userId): List<DietaryRecommendation>` - Creates personalized suggestions
- `refreshRecommendations(Long userId): List<DietaryRecommendation>` - Recalculates recommendations
- `rankFoodSuggestions(List<NutrientDeficiency> deficiencies, HealthData healthData): List<FoodSuggestion>` - Prioritizes foods

**RecommendationEngine** (Core Algorithm)
- `findFoodsForNutrient(Nutrient nutrient, DietaryRestrictions restrictions): List<FoodItem>` - Queries food database
- `scoreFood(FoodItem food, List<NutrientDeficiency> deficiencies): double` - Calculates relevance score
- `applyDietaryRestrictions(List<FoodItem> foods, DietaryRestrictions restrictions): List<FoodItem>` - Filters foods

#### 5. Intervention and Alert Module

**InterventionController**
```java
@RestController
@RequestMapping("/api/interventions")
public class InterventionController {
    GET / - Get active interventions for user
    GET /history - Get past interventions
    PUT /{id}/acknowledge - Mark intervention as acknowledged
}
```

**InterventionService**
- `checkForInterventions(Long userId): List<Intervention>` - Evaluates deficiency patterns
- `createIntervention(Long userId, NutrientDeficiency deficiency, InterventionLevel level): Intervention` - Generates alert
- `escalateIntervention(Long interventionId): Intervention` - Increases priority level
- `acknowledgeIntervention(Long interventionId): void` - Marks as read

**NotificationService**
- `sendEmailNotification(User user, Intervention intervention): void` - Sends email alerts
- `scheduleNotification(Intervention intervention, Duration delay): void` - Queues delayed notifications

#### 6. Reporting Module

**ReportController**
```java
@RestController
@RequestMapping("/api/reports")
public class ReportController {
    GET /nutrition-summary - Get nutrition summary report
    GET /trends - Get nutrient trend data for visualization
    POST /export-pdf - Generate and download PDF report
}
```

**ReportService**
- `generateNutritionSummary(Long userId, int days): NutritionSummaryReport` - Creates summary statistics
- `generateTrendData(Long userId, int days): Map<Nutrient, TrendData>` - Prepares visualization data
- `exportToPDF(Long userId, NutritionSummaryReport report): byte[]` - Generates PDF document

#### 7. Admin Module

**AdminFoodController**
```java
@RestController
@RequestMapping("/api/admin/foods")
@PreAuthorize("hasRole('ADMIN')")
public class AdminFoodController {
    POST / - Add new food item
    PUT /{id} - Update food item
    DELETE /{id} - Deactivate food item
    GET /search - Search food database
}
```

**AdminConfigController**
```java
@RestController
@RequestMapping("/api/admin/config")
@PreAuthorize("hasRole('ADMIN')")
public class AdminConfigController {
    GET /thresholds - Get deficiency thresholds
    PUT /thresholds - Update deficiency thresholds
    GET /recommendation-rules - Get recommendation rules
    POST /recommendation-rules - Create recommendation rule
    PUT /recommendation-rules/{id} - Update recommendation rule
}
```

**AdminDashboardController**
```java
@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {
    GET /statistics - Get system-wide statistics
    GET /deficiency-trends - Get aggregate deficiency data
    GET /critical-users - Get users with critical interventions
    POST /export-data - Export dashboard data as CSV
}
```

**AdminService**
- `addFoodItem(FoodItemDTO): FoodItem` - Creates new food with nutrient profile
- `updateFoodItem(Long id, FoodItemDTO): FoodItem` - Updates food with versioning
- `deactivateFoodItem(Long id): void` - Marks food as inactive
- `updateDeficiencyThreshold(AgeGroup ageGroup, Nutrient nutrient, double threshold): void` - Updates configuration
- `getSystemStatistics(LocalDate startDate, LocalDate endDate): SystemStatistics` - Aggregates metrics

### Frontend Components

#### User Interface Components

**Authentication Views**
- LoginPage - User login form with validation
- RegisterPage - User registration with age/role selection
- ProfilePage - User profile management

**Dietary Tracking Views**
- FoodSearchComponent - Search and select food items with autocomplete
- DietaryEntryForm - Add/edit dietary entries with portion size
- DietaryHistoryList - Display past entries with filtering

**Analysis and Recommendations Views**
- NutrientDashboard - Visual display of current nutrient status with color coding
- RecommendationPanel - Display personalized food suggestions
- InterventionAlerts - Prominent display of active alerts

**Reporting Views**
- NutritionReportPage - Interactive charts showing nutrient trends
- TrendVisualization - Line/bar charts for historical data
- PDFExportButton - Generate and download reports

**Admin Views**
- AdminDashboard - System statistics and aggregate trends
- FoodManagementPage - CRUD operations for food database
- ConfigurationPage - Manage thresholds and recommendation rules
- UserMonitoringPage - View users with critical interventions

## Data Models

### Core Entities

#### User
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String passwordHash;
    
    @Enumerated(EnumType.STRING)
    private UserRole role; // USER, ADMIN
    
    @Column(nullable = false)
    private Integer age;
    
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private HealthData healthData;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<DietaryEntry> dietaryEntries;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
```

#### HealthData
```java
@Entity
@Table(name = "health_data")
public class HealthData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private Double weight; // in kg
    
    @Column(nullable = false)
    private Double height; // in cm
    
    @Enumerated(EnumType.STRING)
    private ActivityLevel activityLevel; // SEDENTARY, LIGHT, MODERATE, ACTIVE, VERY_ACTIVE
    
    @ElementCollection
    @CollectionTable(name = "dietary_restrictions")
    private Set<DietaryRestriction> dietaryRestrictions; // VEGETARIAN, VEGAN, GLUTEN_FREE, etc.
    
    @ElementCollection
    @CollectionTable(name = "allergies")
    private Set<String> allergies;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
```

#### FoodItem
```java
@Entity
@Table(name = "food_items")
public class FoodItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String description;
    
    @Enumerated(EnumType.STRING)
    private FoodCategory category; // FRUIT, VEGETABLE, GRAIN, PROTEIN, DAIRY, etc.
    
    @OneToOne(mappedBy = "foodItem", cascade = CascadeType.ALL)
    private NutrientProfile nutrientProfile;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(nullable = false)
    private Boolean isCustom = false;
    
    @ManyToOne
    @JoinColumn(name = "created_by_user_id")
    private User createdBy; // null for system foods, user for custom foods
    
    @Column(nullable = false)
    private Integer version = 1;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
}
```

#### NutrientProfile
```java
@Entity
@Table(name = "nutrient_profiles")
public class NutrientProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "food_item_id", nullable = false)
    private FoodItem foodItem;
    
    @Column(nullable = false)
    private Double servingSize; // in grams
    
    // Macronutrients (per serving)
    @Column(nullable = false)
    private Double calories;
    
    @Column(nullable = false)
    private Double protein; // in grams
    
    @Column(nullable = false)
    private Double carbohydrates; // in grams
    
    @Column(nullable = false)
    private Double fat; // in grams
    
    @Column(nullable = false)
    private Double fiber; // in grams
    
    // Vitamins (per serving)
    @Column(nullable = false)
    private Double vitaminA; // in mcg
    
    @Column(nullable = false)
    private Double vitaminC; // in mg
    
    @Column(nullable = false)
    private Double vitaminD; // in mcg
    
    @Column(nullable = false)
    private Double vitaminE; // in mg
    
    @Column(nullable = false)
    private Double vitaminK; // in mcg
    
    @Column(nullable = false)
    private Double vitaminB12; // in mcg
    
    // Minerals (per serving)
    @Column(nullable = false)
    private Double calcium; // in mg
    
    @Column(nullable = false)
    private Double iron; // in mg
    
    @Column(nullable = false)
    private Double magnesium; // in mg
    
    @Column(nullable = false)
    private Double zinc; // in mg
    
    @Column(nullable = false)
    private Double potassium; // in mg
}
```

#### DietaryEntry
```java
@Entity
@Table(name = "dietary_entries")
public class DietaryEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "food_item_id", nullable = false)
    private FoodItem foodItem;
    
    @Column(nullable = false)
    private Double portionSize; // multiplier of serving size (e.g., 1.5 servings)
    
    @Column(nullable = false)
    private LocalDateTime consumedAt;
    
    @Enumerated(EnumType.STRING)
    private MealType mealType; // BREAKFAST, LUNCH, DINNER, SNACK
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
}
```

#### NutrientAnalysis
```java
@Entity
@Table(name = "nutrient_analyses")
public class NutrientAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private LocalDate startDate;
    
    @Column(nullable = false)
    private LocalDate endDate;
    
    @Column(nullable = false)
    private Double totalCalories;
    
    @Column(nullable = false)
    private Double totalProtein;
    
    @Column(nullable = false)
    private Double totalCarbohydrates;
    
    @Column(nullable = false)
    private Double totalFat;
    
    @Column(nullable = false)
    private Double totalFiber;
    
    @Column(nullable = false)
    private Double totalVitaminA;
    
    @Column(nullable = false)
    private Double totalVitaminC;
    
    @Column(nullable = false)
    private Double totalVitaminD;
    
    @Column(nullable = false)
    private Double totalCalcium;
    
    @Column(nullable = false)
    private Double totalIron;
    
    // Additional nutrients...
    
    @Column(nullable = false)
    private LocalDateTime calculatedAt;
}
```

#### NutrientDeficiency
```java
@Entity
@Table(name = "nutrient_deficiencies")
public class NutrientDeficiency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "analysis_id", nullable = false)
    private NutrientAnalysis analysis;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Nutrient nutrient;
    
    @Column(nullable = false)
    private Double actualIntake;
    
    @Column(nullable = false)
    private Double recommendedIntake;
    
    @Column(nullable = false)
    private Double deficiencyPercentage; // (recommended - actual) / recommended * 100
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeficiencyLevel level; // MILD, MODERATE, SEVERE
    
    @Column(nullable = false)
    private LocalDateTime detectedAt;
}
```

#### DietaryRecommendation
```java
@Entity
@Table(name = "dietary_recommendations")
public class DietaryRecommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "food_item_id", nullable = false)
    private FoodItem recommendedFood;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Nutrient targetNutrient;
    
    @Column(nullable = false)
    private Double suggestedPortionSize;
    
    @Column(nullable = false)
    private Double relevanceScore; // 0-100, higher is more relevant
    
    @Column(nullable = false)
    private String rationale; // Explanation for recommendation
    
    @Column(nullable = false)
    private Boolean isAcknowledged = false;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDate validUntil;
}
```

#### Intervention
```java
@Entity
@Table(name = "interventions")
public class Intervention {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "deficiency_id", nullable = false)
    private NutrientDeficiency deficiency;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterventionLevel level; // NORMAL, ELEVATED, CRITICAL
    
    @Column(nullable = false)
    private Integer consecutiveDays; // Number of days deficiency has persisted
    
    @Column(nullable = false)
    private String message;
    
    @Column(nullable = false)
    private Boolean isAcknowledged = false;
    
    @Column(nullable = false)
    private Boolean emailSent = false;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime acknowledgedAt;
}
```

#### DeficiencyThreshold
```java
@Entity
@Table(name = "deficiency_thresholds")
public class DeficiencyThreshold {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgeGroup ageGroup; // AGE_1_3, AGE_4_8, AGE_9_13, AGE_14_18
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Nutrient nutrient;
    
    @Column(nullable = false)
    private Double dailyRequirement;
    
    @Column(nullable = false)
    private Boolean isCritical = false; // Whether this nutrient triggers interventions
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @ManyToOne
    @JoinColumn(name = "updated_by_admin_id")
    private User updatedBy;
}
```

### Enumerations

```java
public enum UserRole {
    USER, ADMIN
}

public enum ActivityLevel {
    SEDENTARY, LIGHT, MODERATE, ACTIVE, VERY_ACTIVE
}

public enum DietaryRestriction {
    VEGETARIAN, VEGAN, GLUTEN_FREE, LACTOSE_FREE, NUT_ALLERGY, 
    HALAL, KOSHER, LOW_SODIUM, DIABETIC_FRIENDLY
}

public enum FoodCategory {
    FRUIT, VEGETABLE, GRAIN, PROTEIN, DAIRY, LEGUME, 
    NUT_SEED, BEVERAGE, SNACK, DESSERT, OTHER
}

public enum Nutrient {
    CALORIES, PROTEIN, CARBOHYDRATES, FAT, FIBER,
    VITAMIN_A, VITAMIN_C, VITAMIN_D, VITAMIN_E, VITAMIN_K, VITAMIN_B12,
    CALCIUM, IRON, MAGNESIUM, ZINC, POTASSIUM
}

public enum MealType {
    BREAKFAST, LUNCH, DINNER, SNACK
}

public enum DeficiencyLevel {
    MILD, MODERATE, SEVERE
}

public enum InterventionLevel {
    NORMAL, ELEVATED, CRITICAL
}

public enum AgeGroup {
    AGE_1_3, AGE_4_8, AGE_9_13, AGE_14_18
}
```

### DTOs (Data Transfer Objects)

```java
public class UserRegistrationDTO {
    private String username;
    private String email;
    private String password;
    private Integer age;
    private UserRole role;
}

public class DietaryEntryDTO {
    private Long foodItemId;
    private Double portionSize;
    private LocalDateTime consumedAt;
    private MealType mealType;
}

public class FoodItemDTO {
    private String name;
    private String description;
    private FoodCategory category;
    private NutrientProfileDTO nutrientProfile;
}

public class NutrientProfileDTO {
    private Double servingSize;
    private Double calories;
    private Double protein;
    // ... all nutrient fields
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Valid User Registration Creates Account
*For any* valid user registration data (username, email, password, age, role), submitting the registration should result in a new user account being created and retrievable from the database.
**Validates: Requirements 1.1**

### Property 2: Valid Credentials Authenticate Successfully
*For any* existing user account, providing the correct username and password should result in successful authentication and return a valid authentication token.
**Validates: Requirements 1.2**

### Property 3: Invalid Credentials Are Rejected
*For any* authentication attempt with invalid credentials (non-existent username or incorrect password), the system should reject the attempt and return an error.
**Validates: Requirements 1.3**

### Property 4: Passwords Are Hashed Before Storage
*For any* user account, the stored password in the database should be a hashed value and not the plaintext password.
**Validates: Requirements 1.4**

### Property 5: Food Item Retrieval Includes Nutrient Profile
*For any* food item in the database, retrieving that food item should include its complete associated nutrient profile.
**Validates: Requirements 2.1**

### Property 6: Dietary Entry Persistence Round-Trip
*For any* valid dietary entry (food item, portion size, meal time), creating and persisting the entry should allow it to be retrieved with all original data intact including timestamp.
**Validates: Requirements 2.2, 2.3**

### Property 7: Custom Food Items Are Persisted
*For any* valid custom food item with user-provided nutrient information, creating the custom food should persist it to the database and make it available for dietary entries.
**Validates: Requirements 2.4**

### Property 8: Dietary History Is Sorted By Timestamp
*For any* user's dietary entry list, the entries should be ordered by timestamp in descending order (most recent first).
**Validates: Requirements 2.5**

### Property 9: Nutrient Aggregation Is Correct
*For any* set of dietary entries over a time period, the calculated nutrient totals should equal the sum of (portion size × nutrient value) for each entry, with no duplication or omission.
**Validates: Requirements 3.1, 3.5**

### Property 10: Deficiency Detection Compares Against Thresholds
*For any* nutrient analysis and age-appropriate thresholds, nutrients with intake below the threshold should be flagged as deficient, and nutrients at or above the threshold should not be flagged.
**Validates: Requirements 3.2, 3.3**

### Property 11: Nutrient Requirements Use Health Data
*For any* user, calculating nutrient requirements should incorporate their current age, weight, height, and activity level from health data.
**Validates: Requirements 3.4**

### Property 12: Recommendations Target Deficient Nutrients
*For any* detected nutrient deficiency, the generated food recommendations should contain foods that are rich in (have above-average content of) the deficient nutrient.
**Validates: Requirements 4.1**

### Property 13: Recommendations Respect Dietary Restrictions
*For any* user with dietary restrictions, all generated food recommendations should exclude foods that violate those restrictions (e.g., no meat for vegetarians, no dairy for lactose-free).
**Validates: Requirements 4.2**

### Property 14: Multi-Deficiency Foods Score Higher
*For any* set of recommendations addressing multiple deficiencies, foods that contain multiple deficient nutrients should have higher relevance scores than foods containing only one deficient nutrient.
**Validates: Requirements 4.3**

### Property 15: Recommendations Include Complete Information
*For any* dietary recommendation, the recommendation data should include the food name, nutrient content, portion size, and rationale.
**Validates: Requirements 4.4**

### Property 16: Health Data Validation Rejects Invalid Values
*For any* health data update, the system should reject updates where weight or height are zero, negative, or non-numeric values.
**Validates: Requirements 5.2**

### Property 17: Health Data Updates Are Timestamped
*For any* health data update, the system should store the update with a timestamp indicating when the change was made.
**Validates: Requirements 5.3**

### Property 18: Most Recent Health Data Is Used
*For any* user with multiple health data records, nutrient requirement calculations should use the health data entry with the most recent timestamp.
**Validates: Requirements 5.4**

### Property 19: Dietary Restrictions Are Persisted
*For any* user, setting dietary restrictions should persist them to the database and make them retrievable with the user's health data.
**Validates: Requirements 5.5**

### Property 20: Food Items Require Complete Nutrient Profiles
*For any* food item creation by an admin, the system should reject food items that have missing or null values for essential nutrients (calories, protein, carbohydrates, fat, major vitamins, major minerals).
**Validates: Requirements 6.1, 6.4**

### Property 21: Nutrient Profile Updates Create Versions
*For any* existing food item, updating its nutrient profile should create a new versioned record while preserving the previous version in the database.
**Validates: Requirements 6.2**

### Property 22: Food Deletion Is Soft Delete
*For any* food item deletion by an admin, the food item should remain in the database with isActive set to false rather than being removed.
**Validates: Requirements 6.3**

### Property 23: Food Search Matches Multiple Criteria
*For any* search query, the results should include food items that match the query in their name, category, or nutrient content.
**Validates: Requirements 6.5**

### Property 24: Threshold Updates Affect Future Analyses
*For any* deficiency threshold update, nutrient analyses calculated after the update should use the new threshold value, while analyses calculated before should remain unchanged.
**Validates: Requirements 7.1**

### Property 25: Age Groups Have Independent Thresholds
*For any* nutrient, the system should maintain separate threshold values for each age group (1-3, 4-8, 9-13, 14-18), and changing one age group's threshold should not affect other age groups.
**Validates: Requirements 7.2**

### Property 26: Recommendation Rules Validate References
*For any* recommendation rule creation, the system should reject rules that reference non-existent food items or invalid nutrient types.
**Validates: Requirements 7.3**

### Property 27: Critical Nutrient Flags Are Stored
*For any* nutrient and age group, admins should be able to mark nutrients as critical, and this flag should be persisted and used in intervention logic.
**Validates: Requirements 7.4**

### Property 28: Interventions Appear In Dashboard
*For any* created intervention, the intervention should be included in the user's dashboard data and marked as active until acknowledged.
**Validates: Requirements 8.2**

### Property 29: Intervention Acknowledgment Changes State
*For any* intervention, acknowledging it should set isAcknowledged to true and remove it from the active alerts list.
**Validates: Requirements 8.4**

### Property 30: Reports Contain Trend Data
*For any* nutrition report request with a time period, the generated report should include nutrient intake values for each day or aggregated period within that range.
**Validates: Requirements 9.1**

### Property 31: Reports Show Actual And Recommended Values
*For any* nutrient trend in a report, the data should include both the actual intake values and the recommended daily values for comparison.
**Validates: Requirements 9.3**

### Property 32: Reports Highlight Deficient Periods
*For any* report, periods where nutrient intake fell below the deficiency threshold should be flagged or marked as deficient.
**Validates: Requirements 9.4**

### Property 33: PDF Exports Contain Complete Data
*For any* report export, the generated PDF should contain all visualizations and summary statistics from the report.
**Validates: Requirements 9.5**

### Property 34: Health Data Is Encrypted At Rest
*For any* health data or dietary entry record in the database, the sensitive fields should be encrypted using AES-256 encryption.
**Validates: Requirements 10.1**

### Property 35: Users Can Only Access Own Data
*For any* user, attempting to retrieve another user's dietary entries, health data, or recommendations should be rejected with an authorization error.
**Validates: Requirements 10.4**

### Property 36: Admin Actions Are Logged
*For any* admin action that accesses or modifies user data, an audit log entry should be created with the admin's identifier and timestamp.
**Validates: Requirements 10.5**

### Property 37: Food Items Have Visual Representations
*For any* food item displayed in the UI, the food item data should include an image URL or icon identifier for visual representation.
**Validates: Requirements 11.1**

### Property 38: Dietary Entry Creation Returns Success
*For any* successful dietary entry creation, the API should return a success response with the created entry data.
**Validates: Requirements 11.3**

### Property 39: Nutrient Status Has Color Coding
*For any* nutrient analysis, each nutrient should be assigned a status value (adequate, borderline, deficient) that corresponds to color coding (green, yellow, red).
**Validates: Requirements 11.4**

### Property 40: Admin Dashboard Contains Required Statistics
*For any* admin dashboard request, the response should include total user count, active user count, and average nutrient deficiency statistics.
**Validates: Requirements 12.1**

### Property 41: Deficiency Trends Are Grouped By Age
*For any* admin dashboard deficiency trend data, the trends should be grouped by age range (1-3, 4-8, 9-13, 14-18).
**Validates: Requirements 12.2**

### Property 42: Dashboard Filters Affect Results
*For any* admin dashboard request with a date range filter, all statistics and trends should only include data from within that date range.
**Validates: Requirements 12.3**

### Property 43: Critical Interventions Are Identified
*For any* admin dashboard request, the response should include a list of users who have interventions with level set to CRITICAL.
**Validates: Requirements 12.4**

### Property 44: Dashboard Data Exports To CSV
*For any* dashboard data export request, the system should generate a CSV file containing all dashboard statistics and trend data.
**Validates: Requirements 12.5**

## Error Handling

### Validation Errors

**Input Validation Strategy:**
- All user inputs are validated at the controller layer using Spring Validation annotations
- Custom validators for complex business rules (e.g., age-appropriate thresholds)
- Return HTTP 400 Bad Request with detailed error messages for validation failures

**Common Validation Scenarios:**
- User registration: username/email uniqueness, password strength, age range
- Dietary entries: valid food item ID, positive portion size, valid meal type
- Health data: positive weight/height, valid activity level, age between 1-120
- Admin operations: complete nutrient profiles, valid references, non-negative nutrient values

### Authentication and Authorization Errors

**Security Error Handling:**
- HTTP 401 Unauthorized for invalid credentials or expired tokens
- HTTP 403 Forbidden for insufficient permissions (e.g., non-admin accessing admin endpoints)
- HTTP 404 Not Found for non-existent resources (avoid leaking existence information)

**Implementation:**
- Spring Security exception handlers
- JWT token validation with expiration checking
- Role-based access control enforcement

### Business Logic Errors

**Domain-Specific Error Scenarios:**
- Nutrient analysis with no dietary entries: Return empty analysis with zero values
- Recommendations with no suitable foods: Return empty list with explanation message
- Threshold updates with invalid age group: Reject with validation error
- Food item deletion when referenced by active entries: Soft delete only

**Error Response Format:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for user registration",
  "errors": [
    {
      "field": "age",
      "rejectedValue": 150,
      "message": "Age must be between 1 and 120 years"
    }
  ],
  "path": "/api/auth/register"
}
```

### Database Errors

**Data Layer Error Handling:**
- Constraint violations: Map to appropriate HTTP status codes (409 Conflict for duplicates)
- Connection failures: Retry logic with exponential backoff
- Transaction rollback: Ensure data consistency on failures
- Optimistic locking: Handle concurrent updates gracefully

### External Service Errors

**Email Notification Failures:**
- Queue failed notifications for retry
- Log failures for admin monitoring
- Don't block user operations on notification failures
- Provide alternative notification methods (in-app alerts)

### Logging Strategy

**Log Levels:**
- ERROR: Authentication failures, database errors, unexpected exceptions
- WARN: Validation failures, business rule violations, retry attempts
- INFO: User registrations, admin actions, intervention creations
- DEBUG: Detailed request/response data, calculation steps

**Structured Logging:**
- Include user ID, request ID, timestamp in all logs
- Sanitize sensitive data (passwords, health information)
- Use correlation IDs for request tracing

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit testing and property-based testing to ensure comprehensive coverage:

**Unit Tests:**
- Specific examples demonstrating correct behavior
- Edge cases (empty inputs, boundary values, null handling)
- Error conditions and exception handling
- Integration points between components
- Mock external dependencies (database, email service)

**Property-Based Tests:**
- Universal properties that hold for all inputs
- Comprehensive input coverage through randomization
- Minimum 100 iterations per property test
- Each test references its design document property
- Tag format: **Feature: diet-balance-nutrient-tracker, Property {number}: {property_text}**

### Testing Framework Configuration

**Backend Testing:**
- JUnit 5 for unit tests
- Mockito for mocking dependencies
- Spring Boot Test for integration tests
- jqwik for property-based testing in Java
- TestContainers for database integration tests
- H2 in-memory database for fast unit tests

**Property-Based Testing Library:**
- Use jqwik (Java QuickCheck) for property-based testing
- Configure each property test to run minimum 100 iterations
- Use jqwik's generators for random test data
- Custom generators for domain objects (User, DietaryEntry, FoodItem)

**Example Property Test Configuration:**
```java
@Property
@Label("Feature: diet-balance-nutrient-tracker, Property 1: Valid User Registration Creates Account")
void validUserRegistrationCreatesAccount(
    @ForAll @StringLength(min = 3, max = 50) String username,
    @ForAll @Email String email,
    @ForAll @StringLength(min = 8, max = 100) String password,
    @ForAll @IntRange(min = 1, max = 120) int age
) {
    // Test implementation
}
```

### Test Coverage Goals

**Code Coverage Targets:**
- Service layer: 90%+ line coverage
- Controller layer: 85%+ line coverage
- Utility classes: 95%+ line coverage
- Overall project: 85%+ line coverage

**Property Coverage:**
- Each correctness property must have at least one property-based test
- Each acceptance criterion should be covered by either unit or property tests
- Critical paths (authentication, nutrient calculation, recommendations) require both

### Frontend Testing

**Component Testing:**
- Jest for unit testing React/Vue components
- React Testing Library or Vue Test Utils
- Mock API responses using MSW (Mock Service Worker)
- Test user interactions and state management

**End-to-End Testing:**
- Cypress or Playwright for E2E tests
- Test critical user flows (registration, dietary entry, viewing recommendations)
- Visual regression testing for UI components
- Accessibility testing (WCAG compliance)

### Integration Testing

**API Integration Tests:**
- Test complete request/response cycles
- Verify database persistence
- Test authentication and authorization
- Validate error responses

**Database Integration:**
- Use TestContainers for PostgreSQL/MySQL
- Test complex queries and aggregations
- Verify transaction behavior
- Test data migration scripts

### Performance Testing

**Load Testing:**
- JMeter or Gatling for load testing
- Test concurrent user scenarios
- Identify bottlenecks in nutrient calculations
- Verify response time requirements (< 2 seconds)

**Database Performance:**
- Index optimization for common queries
- Query performance profiling
- Connection pool tuning

### Security Testing

**Security Test Scenarios:**
- SQL injection prevention
- XSS prevention in user inputs
- CSRF protection
- Password hashing verification
- JWT token validation
- Authorization bypass attempts
- Data encryption verification

### Continuous Integration

**CI/CD Pipeline:**
- Run all unit tests on every commit
- Run property tests on pull requests
- Run integration tests before deployment
- Generate code coverage reports
- Automated security scanning
- Database migration testing

**Test Execution Order:**
1. Unit tests (fast feedback)
2. Property-based tests (comprehensive coverage)
3. Integration tests (component interaction)
4. E2E tests (user flows)
5. Performance tests (on staging)

### Test Data Management

**Test Data Strategy:**
- Use builders/factories for test object creation
- Seed database with realistic test data
- Separate test data for different scenarios
- Clean up test data after each test
- Use jqwik arbitraries for property test data generation

**Example Test Data Builders:**
```java
public class UserBuilder {
    public static User.UserBuilder aUser() {
        return User.builder()
            .username("testuser")
            .email("test@example.com")
            .passwordHash(passwordEncoder.encode("password123"))
            .age(15)
            .role(UserRole.USER)
            .createdAt(LocalDateTime.now());
    }
}
```

### Monitoring and Observability

**Production Monitoring:**
- Application metrics (response times, error rates)
- Business metrics (user registrations, dietary entries per day)
- Health checks for database and external services
- Alert thresholds for critical errors

**Logging and Tracing:**
- Structured logging with correlation IDs
- Distributed tracing for request flows
- Error tracking and aggregation
- Performance profiling in production
