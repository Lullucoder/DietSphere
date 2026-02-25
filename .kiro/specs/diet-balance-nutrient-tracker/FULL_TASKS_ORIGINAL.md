# Implementation Plan: Diet Balance Nutrient Tracker

## Overview

This implementation plan breaks down the Diet Balance Nutrient Tracker into discrete, manageable coding tasks. The approach follows a layered architecture pattern, starting with foundational components (data models, security) and building up to business logic and user interfaces. Each task builds incrementally on previous work, with regular checkpoints to ensure quality and integration.

The implementation prioritizes core functionality first (user management, dietary tracking, nutrient analysis) before adding advanced features (recommendations, interventions, reporting). Testing tasks are integrated throughout to catch issues early.

## Tasks

- [x] 1. Project setup and configuration
  - Create Spring Boot project with Maven dependencies (Spring Web, Spring Data JPA, Spring Security, Spring Validation, PostgreSQL driver, jqwik for property testing)
  - Configure application.properties for database connection, security, and logging
  - Set up project structure with packages: controller, service, repository, model, dto, config, security, util
  - Configure Eclipse IDE project settings
  - _Requirements: All (foundational)_

- [x] 2. Implement core data models and enumerations
  - [x] 2.1 Create enumeration classes
    - Implement UserRole, ActivityLevel, DietaryRestriction, FoodCategory, Nutrient, MealType, DeficiencyLevel, InterventionLevel, AgeGroup enums
    - _Requirements: 1.1, 2.1, 5.5, 6.1, 7.2_
  
  - [x] 2.2 Create User entity with JPA annotations
    - Implement User entity with fields: id, username, email, passwordHash, role, age, timestamps
    - Add relationships to HealthData and DietaryEntry
    - _Requirements: 1.1, 1.4_
  
  - [x] 2.3 Create HealthData entity
    - Implement HealthData entity with fields: weight, height, activityLevel, dietaryRestrictions, allergies
    - Add OneToOne relationship to User
    - _Requirements: 3.4, 5.1, 5.2, 5.5_
  
  - [x] 2.4 Create FoodItem and NutrientProfile entities
    - Implement FoodItem entity with fields: name, description, category, isActive, isCustom, version
    - Implement NutrientProfile entity with all nutrient fields (calories, protein, vitamins, minerals)
    - Add OneToOne relationship between FoodItem and NutrientProfile
    - _Requirements: 2.1, 6.1, 6.2, 6.3, 6.4_
  
  - [x] 2.5 Create DietaryEntry entity
    - Implement DietaryEntry entity with fields: user, foodItem, portionSize, consumedAt, mealType
    - Add ManyToOne relationships to User and FoodItem
    - _Requirements: 2.2, 2.3_
  
  - [x] 2.6 Create analysis and recommendation entities
    - Implement NutrientAnalysis entity with nutrient total fields and date range
    - Implement NutrientDeficiency entity with nutrient, actual/recommended intake, deficiency percentage
    - Implement DietaryRecommendation entity with recommendedFood, targetNutrient, relevanceScore, rationale
    - Implement Intervention entity with deficiency, level, consecutiveDays, message, acknowledgment fields
    - Implement DeficiencyThreshold entity with ageGroup, nutrient, dailyRequirement, isCritical
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.3, 7.1, 7.2, 8.1_

- [ ] 3. Implement DTOs and validation
  - [ ] 3.1 Create request/response DTOs
    - Implement UserRegistrationDTO, UserProfileDTO, DietaryEntryDTO, FoodItemDTO, NutrientProfileDTO
    - Add Jackson annotations for JSON serialization
    - _Requirements: 1.1, 2.2, 6.1_
  
  - [ ] 3.2 Add validation annotations to DTOs
    - Add @NotNull, @NotBlank, @Email, @Min, @Max, @Size annotations
    - Create custom validators for age range (1-120), positive weight/height
    - _Requirements: 1.1, 5.1, 5.2, 6.4_
  
  - [ ]* 3.3 Write property tests for DTO validation
    - **Property 16: Health Data Validation Rejects Invalid Values**
    - **Validates: Requirements 5.2**

- [ ] 4. Implement JPA repositories
  - Create repository interfaces extending JpaRepository for all entities: UserRepository, HealthDataRepository, FoodItemRepository, DietaryEntryRepository, NutrientAnalysisRepository, NutrientDeficiencyRepository, DietaryRecommendationRepository, InterventionRepository, DeficiencyThresholdRepository
  - Add custom query methods: findByUsername, findByEmail, findByUserAndConsumedAtBetween, findByUserAndIsAcknowledgedFalse, findByAgeGroupAndNutrient
  - _Requirements: 1.1, 1.2, 2.5, 3.1, 7.1, 8.2_

- [ ] 5. Implement security configuration
  - [ ] 5.1 Configure Spring Security with JWT
    - Create SecurityConfig class with HTTP security configuration
    - Implement JwtTokenProvider for token generation and validation
    - Create JwtAuthenticationFilter for request authentication
    - Configure password encoder (BCrypt)
    - _Requirements: 1.2, 1.4, 10.2_
  
  - [ ] 5.2 Implement UserDetailsService
    - Create CustomUserDetailsService implementing UserDetailsService
    - Load user by username and map to Spring Security UserDetails
    - _Requirements: 1.2_
  
  - [ ]* 5.3 Write property tests for password hashing
    - **Property 4: Passwords Are Hashed Before Storage**
    - **Validates: Requirements 1.4**
  
  - [ ]* 5.4 Write property tests for authorization
    - **Property 35: Users Can Only Access Own Data**
    - **Validates: Requirements 10.4**

- [ ] 6. Implement authentication and user management
  - [ ] 6.1 Create UserService
    - Implement registerUser method with validation and password hashing
    - Implement authenticateUser method returning JWT token
    - Implement updateUserProfile and deleteUserAccount methods
    - _Requirements: 1.1, 1.2, 1.3, 10.3_
  
  - [ ] 6.2 Create UserController
    - Implement POST /api/auth/register endpoint
    - Implement POST /api/auth/login endpoint
    - Implement GET /api/auth/profile endpoint (authenticated)
    - Implement PUT /api/auth/profile endpoint (authenticated)
    - Add error handling and validation
    - _Requirements: 1.1, 1.2_
  
  - [ ]* 6.3 Write property tests for user registration
    - **Property 1: Valid User Registration Creates Account**
    - **Validates: Requirements 1.1**
  
  - [ ]* 6.4 Write property tests for authentication
    - **Property 2: Valid Credentials Authenticate Successfully**
    - **Property 3: Invalid Credentials Are Rejected**
    - **Validates: Requirements 1.2, 1.3**

- [ ] 7. Checkpoint - Ensure authentication tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement dietary entry management
  - [ ] 8.1 Create FoodItemService
    - Implement searchFoodItems method with name/category/nutrient matching
    - Implement getFoodItemById method with nutrient profile loading
    - Implement createCustomFoodItem method for user-defined foods
    - _Requirements: 2.1, 2.4, 6.5_
  
  - [ ] 8.2 Create DietaryEntryService
    - Implement createEntry method with validation and persistence
    - Implement getUserEntries method with date range filtering and sorting
    - Implement updateEntry and deleteEntry methods
    - _Requirements: 2.2, 2.3, 2.5_
  
  - [ ] 8.3 Create DietaryEntryController
    - Implement POST /api/dietary-entries endpoint
    - Implement GET /api/dietary-entries endpoint with date filtering
    - Implement GET /api/dietary-entries/{id} endpoint
    - Implement PUT /api/dietary-entries/{id} endpoint
    - Implement DELETE /api/dietary-entries/{id} endpoint
    - Add authorization checks (user can only access own entries)
    - _Requirements: 2.2, 2.3, 2.5, 10.4_
  
  - [ ]* 8.4 Write property tests for food item retrieval
    - **Property 5: Food Item Retrieval Includes Nutrient Profile**
    - **Validates: Requirements 2.1**
  
  - [ ]* 8.5 Write property tests for dietary entry persistence
    - **Property 6: Dietary Entry Persistence Round-Trip**
    - **Property 7: Custom Food Items Are Persisted**
    - **Validates: Requirements 2.2, 2.3, 2.4**
  
  - [ ]* 8.6 Write property tests for dietary history sorting
    - **Property 8: Dietary History Is Sorted By Timestamp**
    - **Validates: Requirements 2.5**

- [ ] 9. Implement health data management
  - [ ] 9.1 Create HealthDataService
    - Implement updateHealthData method with validation
    - Implement getHealthData method returning most recent record
    - Implement versioning logic to track changes over time
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ] 9.2 Add health data endpoints to UserController
    - Implement GET /api/auth/health-data endpoint
    - Implement PUT /api/auth/health-data endpoint
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ]* 9.3 Write property tests for health data management
    - **Property 17: Health Data Updates Are Timestamped**
    - **Property 18: Most Recent Health Data Is Used**
    - **Property 19: Dietary Restrictions Are Persisted**
    - **Validates: Requirements 5.3, 5.4, 5.5**

- [ ] 10. Implement nutrient analysis engine
  - [ ] 10.1 Create NutrientCalculator utility class
    - Implement calculateDailyRequirements method using age/weight/height/activity level
    - Implement aggregateNutrients method summing nutrient values from dietary entries
    - Implement calculateDeficiencyPercentage method
    - Use standard nutritional formulas (e.g., Harris-Benedict for calorie requirements)
    - _Requirements: 3.1, 3.4, 3.5_
  
  - [ ] 10.2 Create NutrientAnalysisService
    - Implement calculateNutrientIntake method aggregating entries over date range
    - Implement detectDeficiencies method comparing against age-appropriate thresholds
    - Implement getNutrientTrends method for historical analysis
    - _Requirements: 3.1, 3.2, 3.3, 3.5_
  
  - [ ] 10.3 Create NutrientAnalysisController
    - Implement GET /api/analysis/current endpoint
    - Implement GET /api/analysis/history endpoint with date range parameters
    - Implement POST /api/analysis/calculate endpoint
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ]* 10.4 Write property tests for nutrient aggregation
    - **Property 9: Nutrient Aggregation Is Correct**
    - **Property 11: Nutrient Requirements Use Health Data**
    - **Validates: Requirements 3.1, 3.4, 3.5**
  
  - [ ]* 10.5 Write property tests for deficiency detection
    - **Property 10: Deficiency Detection Compares Against Thresholds**
    - **Validates: Requirements 3.2, 3.3**

- [ ] 11. Checkpoint - Ensure nutrient analysis tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Implement recommendation engine
  - [ ] 12.1 Create RecommendationEngine core algorithm
    - Implement findFoodsForNutrient method querying food database by nutrient content
    - Implement scoreFood method calculating relevance based on multiple deficiencies
    - Implement applyDietaryRestrictions method filtering foods
    - Use scoring algorithm: sum of (nutrient_content / deficiency_percentage) for each deficient nutrient
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [ ] 12.2 Create RecommendationService
    - Implement generateRecommendations method orchestrating recommendation logic
    - Implement refreshRecommendations method for manual regeneration
    - Implement rankFoodSuggestions method sorting by relevance score
    - Store recommendations with validity period (7 days)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ] 12.3 Create RecommendationController
    - Implement GET /api/recommendations endpoint
    - Implement POST /api/recommendations/refresh endpoint
    - Implement PUT /api/recommendations/{id}/acknowledge endpoint
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ]* 12.4 Write property tests for recommendation engine
    - **Property 12: Recommendations Target Deficient Nutrients**
    - **Property 13: Recommendations Respect Dietary Restrictions**
    - **Property 14: Multi-Deficiency Foods Score Higher**
    - **Property 15: Recommendations Include Complete Information**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

- [ ] 13. Implement intervention and alert system
  - [ ] 13.1 Create InterventionService
    - Implement checkForInterventions method detecting consecutive deficiency days
    - Implement createIntervention method with level determination (NORMAL/ELEVATED/CRITICAL)
    - Implement escalateIntervention method for persistent deficiencies
    - Implement acknowledgeIntervention method
    - _Requirements: 8.1, 8.2, 8.4, 8.5_
  
  - [ ] 13.2 Create NotificationService
    - Implement sendEmailNotification method (use JavaMail or email service API)
    - Implement scheduleNotification method for delayed notifications
    - Add error handling and retry logic for failed notifications
    - _Requirements: 8.3_
  
  - [ ] 13.3 Create InterventionController
    - Implement GET /api/interventions endpoint
    - Implement GET /api/interventions/history endpoint
    - Implement PUT /api/interventions/{id}/acknowledge endpoint
    - _Requirements: 8.2, 8.4_
  
  - [ ]* 13.4 Write property tests for interventions
    - **Property 28: Interventions Appear In Dashboard**
    - **Property 29: Intervention Acknowledgment Changes State**
    - **Validates: Requirements 8.2, 8.4**

- [ ] 14. Implement reporting module
  - [ ] 14.1 Create ReportService
    - Implement generateNutritionSummary method with statistics calculation
    - Implement generateTrendData method preparing visualization data
    - Implement exportToPDF method using iText or Apache PDFBox library
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ] 14.2 Create ReportController
    - Implement GET /api/reports/nutrition-summary endpoint with days parameter
    - Implement GET /api/reports/trends endpoint
    - Implement POST /api/reports/export-pdf endpoint returning PDF file
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 14.3 Write property tests for reporting
    - **Property 30: Reports Contain Trend Data**
    - **Property 31: Reports Show Actual And Recommended Values**
    - **Property 32: Reports Highlight Deficient Periods**
    - **Property 33: PDF Exports Contain Complete Data**
    - **Validates: Requirements 9.1, 9.3, 9.4, 9.5**

- [ ] 15. Implement admin food management
  - [ ] 15.1 Create AdminService for food operations
    - Implement addFoodItem method with complete nutrient profile validation
    - Implement updateFoodItem method with versioning logic
    - Implement deactivateFoodItem method (soft delete)
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ] 15.2 Create AdminFoodController
    - Implement POST /api/admin/foods endpoint with @PreAuthorize("hasRole('ADMIN')")
    - Implement PUT /api/admin/foods/{id} endpoint
    - Implement DELETE /api/admin/foods/{id} endpoint
    - Implement GET /api/admin/foods/search endpoint
    - _Requirements: 6.1, 6.2, 6.3, 6.5_
  
  - [ ]* 15.3 Write property tests for admin food management
    - **Property 20: Food Items Require Complete Nutrient Profiles**
    - **Property 21: Nutrient Profile Updates Create Versions**
    - **Property 22: Food Deletion Is Soft Delete**
    - **Property 23: Food Search Matches Multiple Criteria**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

- [ ] 16. Implement admin configuration management
  - [ ] 16.1 Extend AdminService for configuration operations
    - Implement updateDeficiencyThreshold method with validation
    - Implement getSystemStatistics method aggregating user and deficiency data
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 12.1_
  
  - [ ] 16.2 Create AdminConfigController
    - Implement GET /api/admin/config/thresholds endpoint
    - Implement PUT /api/admin/config/thresholds endpoint
    - Implement GET /api/admin/config/recommendation-rules endpoint
    - Implement POST /api/admin/config/recommendation-rules endpoint
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ]* 16.3 Write property tests for admin configuration
    - **Property 24: Threshold Updates Affect Future Analyses**
    - **Property 25: Age Groups Have Independent Thresholds**
    - **Property 26: Recommendation Rules Validate References**
    - **Property 27: Critical Nutrient Flags Are Stored**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**

- [ ] 17. Implement admin dashboard
  - [ ] 17.1 Create AdminDashboardController
    - Implement GET /api/admin/dashboard/statistics endpoint
    - Implement GET /api/admin/dashboard/deficiency-trends endpoint with age grouping
    - Implement GET /api/admin/dashboard/critical-users endpoint
    - Implement POST /api/admin/dashboard/export-data endpoint returning CSV
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ]* 17.2 Write property tests for admin dashboard
    - **Property 40: Admin Dashboard Contains Required Statistics**
    - **Property 41: Deficiency Trends Are Grouped By Age**
    - **Property 42: Dashboard Filters Affect Results**
    - **Property 43: Critical Interventions Are Identified**
    - **Property 44: Dashboard Data Exports To CSV**
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

- [ ] 18. Checkpoint - Ensure admin functionality tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Implement data encryption and security
  - [ ] 19.1 Create encryption utility
    - Implement AES-256 encryption/decryption methods
    - Create JPA AttributeConverter for automatic field encryption
    - Apply to sensitive fields in HealthData and DietaryEntry entities
    - _Requirements: 10.1_
  
  - [ ] 19.2 Implement audit logging
    - Create AuditLog entity with admin ID, action, timestamp, affected user
    - Create AOP aspect to log admin actions automatically
    - _Requirements: 10.5_
  
  - [ ]* 19.3 Write property tests for security features
    - **Property 34: Health Data Is Encrypted At Rest**
    - **Property 36: Admin Actions Are Logged**
    - **Validates: Requirements 10.1, 10.5**

- [ ] 20. Implement scheduled tasks
  - [ ] 20.1 Create scheduled job for daily recommendation refresh
    - Use @Scheduled annotation to run daily at midnight
    - Refresh recommendations for all active users based on last 7 days
    - _Requirements: 4.5, 7.5_
  
  - [ ] 20.2 Create scheduled job for intervention checking
    - Run daily to check for consecutive deficiency days
    - Create or escalate interventions as needed
    - Trigger email notifications for critical interventions
    - _Requirements: 8.1, 8.3, 8.5_

- [ ] 21. Implement global exception handling
  - Create @ControllerAdvice class with exception handlers
  - Handle ValidationException, AuthenticationException, AuthorizationException, EntityNotFoundException
  - Return standardized error response format with timestamp, status, message, errors, path
  - Add logging for all exceptions
  - _Requirements: 1.3, 2.2, 5.1, 6.1_

- [ ] 22. Create database initialization scripts
  - [ ] 22.1 Create SQL scripts for initial data
    - Create script to populate DeficiencyThreshold table with standard values for all age groups
    - Create script to populate FoodItem and NutrientProfile tables with common foods (fruits, vegetables, grains, proteins, dairy)
    - Create script to create default admin user
    - _Requirements: 6.1, 7.2_
  
  - [ ] 22.2 Configure Flyway or Liquibase for database migrations
    - Set up migration tool configuration
    - Create initial schema migration
    - Create data seeding migrations
    - _Requirements: All (foundational)_

- [ ] 23. Implement frontend project setup
  - [ ] 23.1 Initialize frontend project
    - Create React project with JavaScript using Vite (npm create vite@latest)
    - Configure Axios for API communication
    - Set up routing with React Router
    - Configure environment variables for API base URL (.env file)
    - _Requirements: All (UI foundation)_
  
  - [ ] 23.2 Create authentication context and API service
    - Implement React Context API for JWT token management
    - Create API service with Axios interceptors for adding JWT token to requests
    - Implement login, register, logout functions
    - _Requirements: 1.1, 1.2_

- [ ] 24. Implement frontend authentication views
  - [ ] 24.1 Create LoginPage component
    - Build login form with username/email and password fields
    - Add form validation and error display
    - Handle successful login (store token, redirect to dashboard)
    - _Requirements: 1.2_
  
  - [ ] 24.2 Create RegisterPage component
    - Build registration form with username, email, password, age, role fields
    - Add form validation (password strength, age range)
    - Handle successful registration (auto-login or redirect to login)
    - _Requirements: 1.1_
  
  - [ ] 24.3 Create ProfilePage component
    - Display user profile information
    - Allow editing of profile fields
    - Include health data form (weight, height, activity level, dietary restrictions)
    - _Requirements: 1.1, 5.1, 5.2, 5.5_

- [ ] 25. Implement frontend dietary tracking views
  - [ ] 25.1 Create FoodSearchComponent
    - Build search input with autocomplete
    - Display search results with food images/icons and nutrient info
    - Allow selection of food items
    - _Requirements: 2.1, 11.1_
  
  - [ ] 25.2 Create DietaryEntryForm component
    - Build form for adding dietary entries (food, portion size, meal type, time)
    - Integrate FoodSearchComponent for food selection
    - Show immediate feedback on successful entry creation
    - _Requirements: 2.2, 11.3_
  
  - [ ] 25.3 Create DietaryHistoryList component
    - Display list of past dietary entries sorted by date (most recent first)
    - Add date range filtering
    - Allow editing and deleting entries
    - _Requirements: 2.5_

- [ ] 26. Implement frontend nutrient analysis views
  - [ ] 26.1 Create NutrientDashboard component
    - Display current nutrient status with color-coded indicators (green/yellow/red)
    - Show nutrient values vs. recommended values
    - Use progress bars or gauges for visual representation
    - _Requirements: 3.1, 3.2, 3.3, 11.4_
  
  - [ ] 26.2 Create RecommendationPanel component
    - Display personalized food recommendations
    - Show food images, nutrient content, portion sizes, and rationale
    - Allow acknowledging recommendations
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ] 26.3 Create InterventionAlerts component
    - Display active interventions prominently at top of dashboard
    - Use color coding for intervention levels (normal/elevated/critical)
    - Allow acknowledging interventions
    - _Requirements: 8.2, 8.4_

- [ ] 27. Implement frontend reporting views
  - [ ] 27.1 Create NutritionReportPage component
    - Add date range selector (7/30/90 days)
    - Display summary statistics
    - Integrate TrendVisualization component
    - Add PDF export button
    - _Requirements: 9.1, 9.2, 9.5_
  
  - [ ] 27.2 Create TrendVisualization component
    - Use Chart.js or D3.js to create line charts for nutrient trends
    - Show actual intake vs. recommended values
    - Highlight deficient periods with different colors
    - _Requirements: 9.1, 9.3, 9.4_

- [ ] 28. Implement frontend admin views
  - [ ] 28.1 Create AdminDashboard component
    - Display system statistics (total users, active users, average deficiencies)
    - Show deficiency trends grouped by age range
    - Display list of users with critical interventions
    - Add CSV export button
    - _Requirements: 12.1, 12.2, 12.4, 12.5_
  
  - [ ] 28.2 Create FoodManagementPage component
    - Display food database with search and filtering
    - Add forms for creating and editing food items with nutrient profiles
    - Implement soft delete functionality
    - _Requirements: 6.1, 6.2, 6.3, 6.5_
  
  - [ ] 28.3 Create ConfigurationPage component
    - Display deficiency thresholds grouped by age group
    - Allow editing thresholds
    - Display and manage recommendation rules
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 29. Implement responsive design and accessibility
  - [ ] 29.1 Apply responsive CSS framework
    - Integrate Bootstrap or Tailwind CSS
    - Ensure all components are mobile-responsive
    - Test on different screen sizes
    - _Requirements: 11.1, 11.3_
  
  - [ ] 29.2 Implement accessibility features
    - Add ARIA labels to interactive elements
    - Ensure keyboard navigation works
    - Test with screen readers
    - Use semantic HTML elements
    - _Requirements: 11.1, 11.2_
  
  - [ ] 29.3 Optimize for children and adolescents
    - Use age-appropriate language in UI text
    - Ensure color contrast meets WCAG standards
    - Add helpful tooltips and guidance
    - _Requirements: 11.2, 11.4_

- [ ] 30. Checkpoint - Ensure frontend integration works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 31. Integration testing and bug fixes
  - [ ]* 31.1 Write integration tests for critical user flows
    - Test complete registration → login → add dietary entry → view analysis flow
    - Test recommendation generation flow
    - Test intervention creation and notification flow
    - Test admin food management flow
    - _Requirements: All_
  
  - [ ] 31.2 Perform manual testing
    - Test all user flows in browser
    - Test admin functionality
    - Verify email notifications
    - Check responsive design on mobile devices
    - _Requirements: All_
  
  - [ ] 31.3 Fix identified bugs and issues
    - Address any bugs found during testing
    - Optimize slow queries or API endpoints
    - Improve error messages and validation
    - _Requirements: All_

- [ ] 32. Documentation and deployment preparation
  - [ ] 32.1 Write API documentation
    - Document all REST endpoints with request/response examples
    - Use Swagger/OpenAPI annotations or create manual documentation
    - _Requirements: All_
  
  - [ ] 32.2 Create deployment configuration
    - Create Dockerfile for backend application
    - Create docker-compose.yml for local development
    - Configure production application.properties
    - Set up environment variable management
    - _Requirements: All (deployment)_
  
  - [ ] 32.3 Write README and setup instructions
    - Document project structure and architecture
    - Provide setup instructions for development environment
    - Document how to run tests
    - Include deployment instructions
    - _Requirements: All (documentation)_

- [ ] 33. Final checkpoint - Complete system verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP development
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and provide opportunities to address issues early
- Property tests validate universal correctness properties across all inputs (minimum 100 iterations each)
- Unit tests validate specific examples, edge cases, and error conditions
- The implementation follows a bottom-up approach: data layer → business logic → API layer → UI layer
- Frontend uses React with JavaScript and Vite for fast, modern development
- Email service integration in task 13.2 can use JavaMail with SMTP or a third-party service like SendGrid
- PDF generation in task 14.1 can use iText (commercial license required for some uses) or Apache PDFBox (open source)
