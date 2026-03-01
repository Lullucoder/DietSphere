# 🥗 DietSphere - Balanced Nutrient Tracker

> A full-stack web application for tracking dietary habits, detecting nutrient deficiencies, and receiving AI-powered nutrition advice — featuring **111 Indian foods**, interactive charts, dark mode, and a local AI chatbot.

Built with **Java 21 + Spring Boot 3.2** (backend), **React 18 + Tailwind CSS** (frontend), and **Ollama** (local AI).

---

## 📖 Table of Contents

1. [What This Application Does](#-what-this-application-does)
2. [Key Features at a Glance](#-key-features-at-a-glance)
3. [Technology Stack](#️-technology-stack)
4. [Architecture Overview](#-architecture-overview)
5. [Entity Relationship Diagram](#-entity-relationship-diagram)
6. [Complete Project Structure](#-complete-project-structure)
7. [Setup & Installation](#-setup--installation)
   - [Prerequisites](#prerequisites)
   - [Step 1 — MySQL Database](#step-1--set-up-mysql-database)
   - [Step 2 — Backend (Spring Boot)](#step-2--run-the-backend-spring-boot)
   - [Step 3 — Frontend (React)](#step-3--run-the-frontend-react)
   - [Step 4 — Ollama AI Chatbot](#step-4--configure-ollama-ai-chatbot-optional)
8. [API Endpoints Reference](#-api-endpoints-reference)
9. [Frontend Pages & Routes](#-frontend-pages--routes)
10. [How Each Feature Works](#-how-each-feature-works)
    - [Authentication & Security](#1-authentication--security-jwt-flow)
    - [Food Database & Seeding](#2-food-database--auto-seeding-111-indian-foods)
    - [Meal Logging](#3-meal-logging)
    - [Nutrition Analysis & Deficiency Detection](#4-nutrition-analysis--deficiency-detection)
    - [AI NutriBot (Ollama Integration)](#5-ai-nutribot-ollama-integration)
    - [Charts & Data Visualization](#6-charts--data-visualization)
    - [Goal Setting](#7-goal-setting)
    - [Dark Mode](#8-dark-mode)
    - [User Profile & Account Management](#9-user-profile--account-management)
11. [Troubleshooting](#-troubleshooting)
12. [License](#-license)

---

## 🎯 What This Application Does

The **Diet Balance Nutrient Tracker** helps users:

1. **Log daily meals** — Search from a database of 111+ Indian foods, select portion sizes and meal types (breakfast, lunch, dinner, snack).
2. **Analyze nutrition** — View macro- and micronutrient intake (16 nutrients) compared against Recommended Daily Allowances (RDA).
3. **Detect deficiencies** — The system calculates an overall nutrition score and highlights which nutrients are below recommended levels, categorized by severity (HIGH / MEDIUM priority).
4. **Get AI-powered advice** — Chat with "NutriBot", a local AI assistant powered by Ollama that knows your today's diet and gives personalized nutrition tips.
5. **Visualize trends** — Six interactive charts (area, bar, pie, radar) show calorie trends, macro splits, meal-type breakdowns, and more over configurable time periods.
6. **Set nutrition goals** — Choose from presets (Weight Loss, Maintenance, Muscle Building, Balanced Indian Diet) or set custom calorie/protein/carbs/fat/fiber targets.
7. **Manage profile** — Update email, age, change password, or delete account with full cascading cleanup.

---

## ✅ Key Features at a Glance

| Category | Features |
|----------|----------|
| **Meal Tracking** | Food search, portion selector, meal type picker, today's entries, full history grouped by date, delete entries |
| **Nutrition Analysis** | 16 nutrients tracked (calories, protein, carbs, fat, fiber, vitamins A/C/D/E/K/B12, calcium, iron, magnesium, zinc, potassium), RDA comparison, overall score, color-coded bars |
| **Deficiency Detection** | Automatic gap analysis, priority levels (HIGH < 50% RDA, MEDIUM < 80% RDA), personalized food recommendations with rationale |
| **AI Chatbot** | NutriBot persona, diet-context-aware responses, suggested prompts, offline detection, Ollama status indicator |
| **Charts & Graphs** | 6 Recharts visualizations: calorie trend (area), daily macros (stacked bar), macro split (donut pie), meal-type breakdown (pie), nutrient radar, top foods (horizontal bar) |
| **Goal Setting** | 4 presets + custom goals, 5 sliders (calories, protein, carbs, fat, fiber), dashboard integration showing progress vs goals |
| **Dark Mode** | System-preference aware, manual toggle, persistent via localStorage, Tailwind `class` strategy |
| **Security** | JWT Bearer tokens (24h expiry), BCrypt password hashing, stateless sessions, change password with verification, cascading account deletion |
| **Food Database** | 111 Indian foods (North & South Indian) with full nutritional profiles, auto-seeded with version-controlled re-seeding |

---

## 🛠️ Technology Stack

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Java** | 21 (LTS) | Programming language |
| **Spring Boot** | 3.2.0 | REST API framework, auto-configuration, embedded Tomcat |
| **Spring Security 6** | 6.x | Authentication, authorization, CORS, CSRF protection |
| **Spring Data JPA** | 3.x | Data access layer, repository abstractions |
| **Hibernate** | 6.x | ORM — maps Java objects to MySQL tables |
| **MySQL** | 8.0+ | Relational database for persistent storage |
| **JWT (jjwt)** | 0.12.3 | Stateless token-based authentication |
| **Lombok** | 1.18.38 | Code generation (getters, setters, constructors, builders) |
| **BCrypt** | (Spring Security) | One-way password hashing |
| **Maven** | 3.9+ | Build tool & dependency management |

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.2 | Component-based UI library |
| **Vite** | 5.0.8 | Lightning-fast dev server & build tool |
| **Tailwind CSS** | 3.4 | Utility-first CSS framework with dark mode |
| **React Router DOM** | 6.20 | Client-side routing with protected routes |
| **Axios** | 1.6.2 | HTTP client with interceptors for JWT |
| **Recharts** | 3.7 | Declarative chart components (area, bar, pie, radar) |
| **Framer Motion** | 12.34 | Animation library for smooth transitions |
| **React Icons** | 5.5 | Icon library (Heroicons, FontAwesome, etc.) |
| **React Hot Toast** | 2.6 | Toast notification system |
| **@tailwindcss/forms** | 0.5.11 | Form element styling plugin |

### AI / Machine Learning

| Technology | Purpose |
|-----------|---------|
| **Ollama** | Local AI model server (runs on your machine — no cloud dependency) |
| **llama3.2:1b** | Default lightweight language model for diet advice |
| **Spring RestTemplate** | HTTP client to communicate with Ollama API |

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                               │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  React 18 Frontend (localhost:5173)                          │   │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌──────────────┐ │   │
│  │  │ LoginPage│ │Dashboard │ │NutritionAn-│ │  AiChat.jsx  │ │   │
│  │  │ Register │ │FoodLog   │ │alysis.jsx  │ │  Charts.jsx  │ │   │
│  │  │ Page.jsx │ │MealHist  │ │GoalSettings│ │  UserProfile │ │   │
│  │  └──────────┘ └──────────┘ └────────────┘ └──────────────┘ │   │
│  │                     │                                        │   │
│  │              api.js (Axios)                                  │   │
│  │    ┌──────────────────────────────┐                          │   │
│  │    │ JWT Token in Authorization   │                          │   │
│  │    │ Header (Bearer <token>)      │                          │   │
│  │    └──────────────────────────────┘                          │   │
│  └──────────────────────┬───────────────────────────────────────┘   │
│                         │ HTTP REST (JSON)                          │
└─────────────────────────┼───────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│             Spring Boot Backend (localhost:8080)                     │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                 Security Layer                               │   │
│  │  SecurityConfig → JwtAuthenticationFilter → JwtTokenProvider │   │
│  │  (CORS, CSRF off, stateless sessions, public/private paths) │   │
│  └─────────────────────────┬───────────────────────────────────┘   │
│                             │                                       │
│  ┌─────────────────────────┴───────────────────────────────────┐   │
│  │                    Controllers (REST API)                    │   │
│  │  AuthController    │ DietaryEntryController │ FoodController │   │
│  │  NutrientAnalysis  │ AiController           │ ChartController│   │
│  │  Controller        │ GoalController         │ HealthCheck    │   │
│  └─────────────────────────┬───────────────────────────────────┘   │
│                             │                                       │
│  ┌─────────────────────────┴───────────────────────────────────┐   │
│  │                    Services (Business Logic)                 │   │
│  │  UserService │ DietaryEntryService │ FoodItemService         │   │
│  │  NutrientAnalysisService │ AiService │ ChartDataService      │   │
│  └────────────┬─────────────────────────┬──────────────────────┘   │
│               │                         │                           │
│  ┌────────────▼──────────┐   ┌──────────▼──────────────────────┐   │
│  │  Repositories (JPA)   │   │   Ollama AI Server              │   │
│  │  UserRepository       │   │   (localhost:11434)              │   │
│  │  FoodItemRepository   │   │   POST /api/chat                │   │
│  │  DietaryEntryRepo     │   │   GET  /api/tags                │   │
│  │  NutrientProfileRepo  │   └─────────────────────────────────┘   │
│  │  NutritionGoalRepo    │                                         │
│  │  HealthDataRepository │                                         │
│  └────────────┬──────────┘                                         │
│               │                                                     │
└───────────────┼─────────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    MySQL Database (localhost:3306)                   │
│                    Schema: nutrition_db                              │
│                                                                     │
│  Tables: users, food_items, nutrient_profiles, dietary_entries,     │
│          nutrition_goals, health_data, nutrient_analyses,           │
│          nutrient_deficiencies, dietary_recommendations             │
└─────────────────────────────────────────────────────────────────────┘
```

**Request Flow:**
1. User interacts with React frontend
2. `api.js` sends HTTP request with JWT token in `Authorization` header
3. `JwtAuthenticationFilter` intercepts the request, validates the token via `JwtTokenProvider`
4. If valid, sets `SecurityContext` and forwards to the appropriate Controller
5. Controller delegates to Service layer for business logic
6. Service uses Repository to read/write from MySQL
7. For AI features, `AiService` communicates with Ollama via `RestTemplate`
8. Response flows back as JSON to the frontend

---

## 📐 Entity Relationship Diagram

```
┌─────────────────────┐       ┌──────────────────────┐
│       USER           │       │    NUTRITION_GOAL    │
├─────────────────────┤       ├──────────────────────┤
│ id (PK)             │──1:1──│ id (PK)              │
│ username (unique)   │       │ user_id (FK, unique)  │
│ email (unique)      │       │ calorie_goal (2000)   │
│ password_hash       │       │ protein_goal (50)     │
│ role (USER/ADMIN)   │       │ carbs_goal (300)      │
│ age                 │       │ fat_goal (65)         │
│ created_at          │       │ fiber_goal (25)       │
│ updated_at          │       │ created_at            │
└────────┬────────────┘       └──────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐       ┌──────────────────────┐
│   DIETARY_ENTRY     │       │      FOOD_ITEM       │
├─────────────────────┤       ├──────────────────────┤
│ id (PK)             │  N:1  │ id (PK)              │
│ user_id (FK)        │──────▶│ name                 │
│ food_item_id (FK)   │       │ description          │
│ portion_size        │       │ category (enum)      │
│ consumed_at         │       │ is_active            │
│ meal_type (enum)    │       │ is_custom            │
│ created_at          │       │ created_by (FK)      │
└─────────────────────┘       │ version              │
                              │ created_at           │
                              └────────┬─────────────┘
                                       │ 1:1
                                       ▼
                              ┌──────────────────────┐
                              │  NUTRIENT_PROFILE    │
                              ├──────────────────────┤
                              │ id (PK)              │
                              │ food_item_id (FK)    │
                              │ serving_size         │
                              │ calories             │
                              │ protein              │
                              │ carbohydrates        │
                              │ fat                  │
                              │ fiber                │
                              │ vitamin_a / c / d /  │
                              │ e / k / b12          │
                              │ calcium, iron,       │
                              │ magnesium, zinc,     │
                              │ potassium            │
                              └──────────────────────┘

┌─────────────────────┐       ┌──────────────────────┐
│  NUTRIENT_ANALYSIS  │──1:N──│ NUTRIENT_DEFICIENCY  │
├─────────────────────┤       ├──────────────────────┤
│ id (PK)             │       │ id (PK)              │
│ user_id             │       │ analysis_id (FK)     │
│ start_date          │       │ nutrient (enum)      │
│ end_date            │       │ actual_intake        │
│ total_calories      │       │ recommended_intake   │
│ total_protein       │       │ deficiency_percentage│
│ total_carbs/fat/etc │       │ deficiency_level     │
└─────────────────────┘       └──────────────────────┘
```

**Key Relationships:**
- **User → DietaryEntry**: One-to-Many (a user can log many meals)
- **FoodItem → NutrientProfile**: One-to-One (each food has exactly one nutrient profile)
- **DietaryEntry → FoodItem**: Many-to-One (each entry references one food)
- **User → NutritionGoal**: One-to-One (each user has one set of goals)
- **NutrientAnalysis → NutrientDeficiency**: One-to-Many (an analysis can reveal multiple deficiencies)

---

## 📁 Complete Project Structure

Every file in this project and its purpose:

```
FSAD-Project/
│
├── pom.xml                          # Maven build config — all backend dependencies
├── README.md                        # This file
├── MVP_PLAN.md                      # Initial project planning document
├── IMPLEMENTATION_STATUS.md         # Feature implementation tracking
├── QUICK_START.md                   # Quick setup reference
│
├── src/main/
│   ├── java/com/nutrition/dietbalancetracker/
│   │   │
│   │   ├── DietBalanceTrackerApplication.java   # Spring Boot entry point (@SpringBootApplication)
│   │   │
│   │   ├── model/                               # JPA Entities — the data model
│   │   │   ├── User.java                        # User entity: username, email, passwordHash, role, age
│   │   │   ├── FoodItem.java                    # Food entity: name, description, category, isCustom, version
│   │   │   ├── NutrientProfile.java             # 16 nutrients per food: calories, protein, carbs, fat,
│   │   │   │                                    #   fiber, vitamins (A,C,D,E,K,B12), minerals (Ca,Fe,Mg,Zn,K)
│   │   │   ├── DietaryEntry.java                # A logged meal: user, food, portionSize, consumedAt, mealType
│   │   │   ├── NutritionGoal.java               # User's nutrition targets: calories, protein, carbs, fat, fiber
│   │   │   ├── NutrientAnalysis.java            # Computed analysis over a date range (totals for all nutrients)
│   │   │   ├── NutrientDeficiency.java          # A single deficiency: nutrient, actual vs recommended, severity
│   │   │   ├── DietaryRecommendation.java       # Personalized food suggestion for a deficient nutrient
│   │   │   ├── HealthData.java                  # Extended health info linked to user
│   │   │   │
│   │   │   │  --- Enums ---
│   │   │   ├── FoodCategory.java               # FRUIT, VEGETABLE, GRAIN, PROTEIN, DAIRY, LEGUME,
│   │   │   │                                   #   NUT_SEED, BEVERAGE, SNACK, DESSERT, OTHER
│   │   │   ├── MealType.java                   # BREAKFAST, LUNCH, DINNER, SNACK
│   │   │   ├── UserRole.java                   # USER, ADMIN
│   │   │   ├── Nutrient.java                   # Enum of all tracked nutrients
│   │   │   ├── DeficiencyLevel.java            # Severity levels for deficiency
│   │   │   ├── DeficiencyThreshold.java        # Threshold constants
│   │   │   ├── ActivityLevel.java              # SEDENTARY, LIGHT, MODERATE, ACTIVE, VERY_ACTIVE
│   │   │   ├── AgeGroup.java                   # Age-based grouping for RDA
│   │   │   ├── DietaryRestriction.java         # VEGETARIAN, VEGAN, GLUTEN_FREE, etc.
│   │   │   ├── Intervention.java               # Types of dietary interventions
│   │   │   └── InterventionLevel.java          # Urgency levels for interventions
│   │   │
│   │   ├── repository/                          # Spring Data JPA Repositories
│   │   │   ├── UserRepository.java              # findByUsername, existsByUsername, existsByEmail
│   │   │   ├── FoodItemRepository.java          # Food search queries
│   │   │   ├── DietaryEntryRepository.java      # findByUserId, findByDateRange, deleteByFoodItemIn
│   │   │   ├── NutrientProfileRepository.java   # Nutrient profile CRUD + deleteByFoodItemIn
│   │   │   ├── NutritionGoalRepository.java     # findByUserId, deleteByUserId
│   │   │   └── HealthDataRepository.java        # Health data CRUD
│   │   │
│   │   ├── service/                              # Business Logic Layer
│   │   │   ├── UserService.java                  # Register (BCrypt + JWT), Login (verify + JWT)
│   │   │   ├── FoodItemService.java              # Food search and lookup
│   │   │   ├── DietaryEntryService.java          # Log/retrieve/delete meal entries
│   │   │   ├── NutrientAnalysisService.java      # Aggregate nutrients, compare to RDA, score, recommend
│   │   │   ├── AiService.java                    # Build diet context → Ollama chat → parse response
│   │   │   └── ChartDataService.java             # Build 5 chart datasets from dietary entries
│   │   │
│   │   ├── controller/                           # REST API Endpoints
│   │   │   ├── AuthController.java               # Register, Login, Profile CRUD, Change Password, Delete Account
│   │   │   ├── DietaryEntryController.java       # Log meals, Get entries, Today's entries, Delete entry
│   │   │   ├── FoodController.java               # Search foods
│   │   │   ├── NutrientAnalysisController.java   # Today & weekly nutrient analysis
│   │   │   ├── AiController.java                 # AI chat & Ollama status
│   │   │   ├── ChartController.java              # Chart data for given user/period
│   │   │   ├── GoalController.java               # Get & update nutrition goals
│   │   │   └── HealthCheckController.java        # Server health check
│   │   │
│   │   ├── dto/                                  # Data Transfer Objects
│   │   │   ├── LoginRequestDTO.java              # { username, password }
│   │   │   ├── LoginResponseDTO.java             # { token, username, email, userId }
│   │   │   ├── UserRegistrationDTO.java          # { username, email, password, age }
│   │   │   ├── UserProfileDTO.java               # { id, username, email, age, createdAt }
│   │   │   ├── DietaryEntryDTO.java              # { foodItemId, portionSize, consumedAt, mealType }
│   │   │   ├── DietaryEntryResponseDTO.java      # Entry + food name + category + all computed nutrients
│   │   │   ├── FoodItemResponseDTO.java          # Food + full nutrient profile
│   │   │   ├── NutrientAnalysisDTO.java          # { totalCalories, mealCount, overallScore,
│   │   │   │                                     #   macronutrients[], micronutrients[], recommendations[] }
│   │   │   ├── AiChatRequestDTO.java             # { message, userId, history[] }
│   │   │   ├── AiChatResponseDTO.java            # { reply, success }
│   │   │   ├── ChartDataDTO.java                 # { dailyTrend[], macroSplit, mealTypeBreakdown[],
│   │   │   │                                     #   topFoods[], nutrientRadar[] }
│   │   │   ├── NutritionGoalDTO.java             # { calorieGoal, proteinGoal, carbsGoal, fatGoal, fiberGoal }
│   │   │   └── PasswordChangeDTO.java            # { currentPassword, newPassword }
│   │   │
│   │   ├── security/                             # Security Configuration
│   │   │   ├── SecurityConfig.java               # CORS, CSRF, session policy, public/private routes,
│   │   │   │                                     #   BCryptPasswordEncoder bean, JWT filter registration
│   │   │   ├── JwtTokenProvider.java             # Generate, validate, parse JWT tokens (HS256, 24h expiry)
│   │   │   └── JwtAuthenticationFilter.java      # OncePerRequestFilter — extracts Bearer token, validates,
│   │   │                                         #   sets SecurityContext for authenticated requests
│   │   │
│   │   └── config/
│   │       └── DataInitializer.java              # CommandLineRunner — seeds 111 Indian foods on startup
│   │                                             #   with SEED_VERSION mechanism for re-seeding
│   │
│   └── resources/
│       └── application.properties                # All configuration: MySQL, JPA, JWT, Logging, Ollama
│
├── frontend/
│   ├── package.json                # NPM dependencies & scripts
│   ├── vite.config.js              # Vite dev server & build config
│   ├── tailwind.config.js          # Tailwind CSS config: darkMode 'class', brand color indigo
│   ├── postcss.config.js           # PostCSS plugins (Tailwind + Autoprefixer)
│   ├── eslint.config.js            # ESLint configuration
│   ├── vercel.json                 # Vercel deployment config (SPA rewrites)
│   ├── index.html                  # HTML entry point
│   │
│   └── src/
│       ├── main.jsx                # React DOM render entry point
│       ├── App.jsx                 # Root component: ThemeProvider, Router, Routes, auth state
│       ├── App.css                 # Minimal global styles
│       ├── index.css               # Tailwind directives & dark mode base styles
│       │
│       ├── contexts/
│       │   └── ThemeContext.jsx     # Dark mode context: localStorage persistence, system preference,
│       │                           #   toggles 'dark' class on <html>
│       │
│       ├── components/
│       │   └── Layout.jsx          # Shared sidebar: nav links (9 pages), dark mode toggle,
│       │                           #   sign out, responsive hamburger menu
│       │
│       ├── pages/
│       │   ├── LoginPage.jsx       # Split-screen: gradient branding + login form, JWT on success
│       │   ├── RegisterPage.jsx    # Split-screen: gradient branding + registration form
│       │   ├── Dashboard.jsx       # Stat cards (cal/protein/carbs/fat vs goals), calorie ring,
│       │   │                       #   macro progress bars, today's meal list
│       │   ├── FoodLogging.jsx     # Food search → grid → portion selector → meal type → confirm
│       │   ├── MealHistory.jsx     # Date-grouped entries with delete, empty state
│       │   ├── NutritionAnalysis.jsx # Period toggle, summary cards, overall score bar,
│       │   │                       #   macronutrient bars, vitamin/mineral bars, recommendations
│       │   ├── UserProfile.jsx     # Avatar, stats cards, account info editor, change password,
│       │   │                       #   danger zone (delete account)
│       │   ├── AiChat.jsx          # Chat interface with NutriBot, suggested prompts, typing
│       │   │                       #   indicator, Ollama status, offline setup instructions
│       │   ├── Charts.jsx          # 6 Recharts: calorie trend (area), daily macros (stacked bar),
│       │   │                       #   macro split (donut), meals by type (pie), nutrient radar,
│       │   │                       #   top foods (horizontal bar). Period toggle (7/14/30 days).
│       │   └── GoalSettings.jsx    # 4 presets, 5 sliders + number inputs, save/reset
│       │
│       └── services/
│           └── api.js              # Axios instance: baseURL, JWT request interceptor,
│                                   #   401 response interceptor → auto logout
│
└── target/                         # Maven build output (auto-generated, not committed)
```

---

## 🚀 Setup & Installation

### Prerequisites

| Tool | Version | Verify With | Download |
|------|---------|-------------|----------|
| **Java JDK** | 21+ | `java -version` | [adoptium.net](https://adoptium.net/) |
| **Maven** | 3.9+ | `mvn -version` | [maven.apache.org](https://maven.apache.org/) |
| **MySQL** | 8.0+ | `mysql --version` | [dev.mysql.com](https://dev.mysql.com/downloads/) |
| **Node.js** | 18+ | `node -v` | [nodejs.org](https://nodejs.org/) |
| **npm** | 9+ | `npm -v` | (comes with Node.js) |
| **Ollama** | Latest | `ollama --version` | [ollama.com](https://ollama.com/) *(optional, for AI chat)* |

---

### Step 1 — Set Up MySQL Database

Open MySQL CLI (or MySQL Workbench) and run:

```sql
CREATE DATABASE IF NOT EXISTS nutrition_db;
```

The app uses `root` / `root` by default. If your credentials differ, edit `src/main/resources/application.properties`:

```properties
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

> **Note:** The connection URL includes `?createDatabaseIfNotExist=true`, so the database is auto-created if MySQL is running.

---

### Step 2 — Run the Backend (Spring Boot)

```bash
# Navigate to the project root
cd FSAD-Project

# Build and run (Windows — use mvn.cmd)
mvn.cmd spring-boot:run

# OR on macOS/Linux:
mvn spring-boot:run
```

Wait for this message in the console:
```
Started DietBalanceTrackerApplication in X.XXs
```

**What happens on first run:**
1. Hibernate auto-creates all database tables (`ddl-auto=update`)
2. `DataInitializer` seeds **111 Indian foods** with complete nutritional data
3. Backend is available at **http://localhost:8080**

> **Tip (Windows PowerShell):** If `mvn` doesn't work, use the full path:  
> `& "C:\Program Files\Maven\apache-maven-3.9.12\bin\mvn.cmd" spring-boot:run`

---

### Step 3 — Run the Frontend (React)

Open a **new terminal**:

```bash
cd FSAD-Project/frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Frontend is available at **http://localhost:5173**

Now open your browser and navigate to `http://localhost:5173`. You should see the login page.

---

### Step 4 — Configure Ollama AI Chatbot (Optional)

The **NutriBot** feature requires a local Ollama server. Without it, the app works perfectly — you just won't have the AI chat feature.

#### 4.1 — Install Ollama

Download from [https://ollama.com/download](https://ollama.com/download) and install.

#### 4.2 — Pull the AI Model

```bash
ollama pull llama3.2:1b
```

> This downloads the **llama3.2:1b** model (~1.3 GB). You can also use `llama3.2:3b` (better quality, ~2 GB) — just update `application.properties`:
> ```properties
> ollama.model=llama3.2:3b
> ```

#### 4.3 — Start the Ollama Server

```bash
ollama serve
```

This starts the Ollama API at **http://localhost:11434**.

> **Verify it's running:** Visit `http://localhost:11434` in your browser — you should see "Ollama is running".

#### 4.4 — Test in the App

1. Navigate to the **NutriBot** page in the app
2. You should see a green "Ollama Connected" indicator
3. Try asking: "What should I eat for dinner?"

> **Troubleshooting:** If NutriBot shows "Ollama Offline":
> - Make sure `ollama serve` is running in a terminal
> - Check that the model is downloaded: `ollama list`
> - Verify the URL in `application.properties`: `ollama.base-url=http://localhost:11434`

---

## 📊 API Endpoints Reference

All endpoints return JSON. Endpoints marked 🔒 require `Authorization: Bearer <jwt-token>` header.

### Authentication — `/api/auth` (Public)

| Method | Path | Body | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | `{ username, email, password, age }` | Create new account → returns JWT token |
| `POST` | `/api/auth/login` | `{ username, password }` | Login → returns `{ token, username, email, userId }` |
| `GET` | `/api/auth/profile?userId=` | — | 🔒 Get user profile (username, email, age, createdAt) |
| `PUT` | `/api/auth/profile?userId=` | `{ email, age }` | 🔒 Update profile fields |
| `PUT` | `/api/auth/change-password?userId=` | `{ currentPassword, newPassword }` | 🔒 Change password (verifies current) |
| `DELETE` | `/api/auth/account?userId=` | — | 🔒 Delete account (cascading: goals → entries → user) |

### Food Items — `/api/foods` 🔒

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/foods/search?query=paneer` | Search foods by name — returns matching foods with full nutrient profiles |

### Dietary Entries — `/api/entries` 🔒

| Method | Path | Body | Description |
|--------|------|------|-------------|
| `POST` | `/api/entries?userId=` | `{ foodItemId, portionSize, consumedAt, mealType }` | Log a new meal entry |
| `GET` | `/api/entries?userId=` | — | Get all entries for user (newest first) |
| `GET` | `/api/entries/today?userId=` | — | Get today's entries only |
| `DELETE` | `/api/entries/{id}?userId=` | — | Delete a specific entry |

### Nutrient Analysis — `/api/analysis` 🔒

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/analysis/today?userId=` | Today's nutrient totals, percentages vs RDA, overall score, recommendations |
| `GET` | `/api/analysis/week?userId=` | 7-day average analysis with same structure |

### AI Chat — `/api/ai` 🔒

| Method | Path | Body | Description |
|--------|------|------|-------------|
| `POST` | `/api/ai/chat` | `{ message, userId, history[] }` | Send message to NutriBot, get diet-aware AI reply |
| `GET` | `/api/ai/status` | — | Check if Ollama server is reachable |

### Charts — `/api/charts` 🔒

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/charts?userId=&days=7` | Get chart datasets (dailyTrend, macroSplit, mealTypeBreakdown, topFoods, nutrientRadar) |

### Nutrition Goals — `/api/goals` 🔒

| Method | Path | Body | Description |
|--------|------|------|-------------|
| `GET` | `/api/goals?userId=` | — | Get user's nutrition goals (defaults: 2000/50/300/65/25) |
| `PUT` | `/api/goals?userId=` | `{ calorieGoal, proteinGoal, carbsGoal, fatGoal, fiberGoal }` | Update goals |

### Health Check — `/api/health` (Public)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Returns `{ status: "UP", timestamp }` — used for uptime monitoring |

---

## 🖥 Frontend Pages & Routes

| Route | Page Component | Auth Required | Description |
|-------|---------------|---------------|-------------|
| `/login` | `LoginPage.jsx` | No | Split-screen login with gradient branding panel. Stores JWT in localStorage. |
| `/register` | `RegisterPage.jsx` | No | Registration form (username, email, password, age). Auto-logs in on success. |
| `/dashboard` | `Dashboard.jsx` | Yes | Overview: stat cards showing today's calories/protein/carbs/fat vs goals, animated calorie ring, macro progress bars, today's meal list. |
| `/log-food` | `FoodLogging.jsx` | Yes | Search 111+ foods, view in grid/cards, select portion (0.5x–3x), choose meal type, confirm & log. |
| `/history` | `MealHistory.jsx` | Yes | All past entries grouped by date, shows food name, meal type, portion, calories. Delete entries with confirmation. |
| `/nutrition` | `NutritionAnalysis.jsx` | Yes | Toggle today/week. Summary stats, overall nutrition score (0–100) with animated bar, macronutrient breakdown bars, vitamin & mineral bars, personalized recommendations with HIGH/MEDIUM priority. |
| `/ai-chat` | `AiChat.jsx` | Yes | Full chat interface with NutriBot AI. Suggested quick prompts, message bubbles, typing indicator, Ollama online/offline status, setup instructions when offline. |
| `/charts` | `Charts.jsx` | Yes | 6 interactive Recharts visualizations with period toggle (7/14/30 days). Responsive grid layout. |
| `/goals` | `GoalSettings.jsx` | Yes | 4 preset plans (Weight Loss/Maintenance/Muscle Building/Balanced Indian Diet), 5 sliders with numeric inputs, save & reset. |
| `/profile` | `UserProfile.jsx` | Yes | Avatar initials, account stats, editable email/age, change password form, danger zone to delete account. |
| `/` | — | — | Redirects to `/dashboard` if logged in, `/login` if not. |

**Protected Routes:** All routes except `/login` and `/register` check for a valid user object in state. If not found, the user is redirected to `/login`. The `api.js` response interceptor also catches 401 errors and forces logout.

---

## 🔬 How Each Feature Works

### 1. Authentication & Security (JWT Flow)

```
    User                Frontend (React)              Backend (Spring Boot)            MySQL
     │                       │                              │                           │
     │  Fill login form      │                              │                           │
     │  ───────────────►     │                              │                           │
     │                       │  POST /api/auth/login        │                           │
     │                       │  { username, password }      │                           │
     │                       │  ──────────────────────────► │                           │
     │                       │                              │  Find user by username    │
     │                       │                              │  ─────────────────────►   │
     │                       │                              │  ◄─────────────────────   │
     │                       │                              │                           │
     │                       │                              │  BCrypt.matches(password, │
     │                       │                              │    user.passwordHash)     │
     │                       │                              │                           │
     │                       │                              │  JwtTokenProvider         │
     │                       │                              │    .generateToken(user)   │
     │                       │                              │    HS256 + 24h expiry     │
     │                       │                              │                           │
     │                       │  { token, username, email,   │                           │
     │                       │    userId }                  │                           │
     │                       │  ◄────────────────────────── │                           │
     │                       │                              │                           │
     │                       │  localStorage.setItem(       │                           │
     │                       │    'user', JSON.stringify())  │                           │
     │  Redirect to          │                              │                           │
     │  /dashboard           │                              │                           │
     │  ◄───────────────     │                              │                           │
```

**Key Security Components:**

| File | Role |
|------|------|
| `SecurityConfig.java` | Configures CORS (allows `localhost:5173` and `:3000`), disables CSRF (stateless API), sets session to `STATELESS`, defines public paths (`/api/auth/**`, `/api/health`), registers JWT filter |
| `JwtTokenProvider.java` | Creates tokens using HS256 algorithm with a secret key, 24-hour expiry. Provides `generateToken()`, `getUsernameFromToken()`, `validateToken()` |
| `JwtAuthenticationFilter.java` | `OncePerRequestFilter` — runs on every request. Extracts `Bearer` token from `Authorization` header, validates via `JwtTokenProvider`, sets Spring `SecurityContext` |
| `api.js` (frontend) | Request interceptor attaches token; response interceptor catches 401 → clears localStorage → redirects to `/login` |

**Password Security:**
- Passwords are hashed with **BCrypt** before storage (one-way hash, never stored as plaintext)
- Change password requires verification of current password first
- Account deletion uses `@Transactional` to cascade: delete goals → delete entries → delete user

---

### 2. Food Database & Auto-Seeding (111 Indian Foods)

**File:** `DataInitializer.java`

On every application startup:
1. Checks if system foods exist and their version matches `SEED_VERSION = 2`
2. If version mismatch or no foods → deletes old data and re-seeds
3. Creates **111 food items** with full `NutrientProfile` (16 nutrients each)

**Food Categories Covered:**

| Category | Example Foods |
|----------|---------------|
| **GRAIN** | Roti, Naan, Paratha, Puri, Dosa, Idli, Appam, Upma, Poha, Biryani, Pulao |
| **LEGUME** | Dal (Toor, Masoor, Chana, Moong), Rajma, Chole, Sambar, Rasam |
| **PROTEIN** | Chicken Curry, Fish Curry, Egg Bhurji, Paneer Butter Masala, Mutton Rogan Josh |
| **VEGETABLE** | Palak Paneer, Aloo Gobi, Baingan Bharta, Bhindi Masala, Poriyal, Avial, Kootu |
| **DAIRY** | Curd/Yogurt, Lassi, Raita, Paneer Tikka, Milk |
| **FRUIT** | Apple, Banana, Mango, Papaya, Guava |
| **SNACK** | Vada, Samosa, Pakora, Murukku, Banana Chips, Medu Vada |
| **DESSERT** | Gulab Jamun, Jalebi, Kheer, Halwa, Payasam, Mysore Pak |
| **BEVERAGE** | Masala Chai, Filter Coffee, Buttermilk |

**Each food has these 16 nutrients:**
Calories, Protein, Carbohydrates, Fat, Fiber, Vitamin A, Vitamin C, Vitamin D, Vitamin E, Vitamin K, Vitamin B12, Calcium, Iron, Magnesium, Zinc, Potassium

---

### 3. Meal Logging

**Frontend Flow (`FoodLogging.jsx`):**
1. User types in search bar → `GET /api/foods/search?query=...`
2. Matching foods displayed as cards in a grid
3. User clicks a food → detail panel shows nutrient info
4. User selects portion size (0.5x, 1x, 1.5x, 2x, 3x) and meal type (Breakfast/Lunch/Dinner/Snack)
5. Click "Log Meal" → `POST /api/entries?userId=...`

**Backend Calculation:**
The `DietaryEntry.portionSize` acts as a **multiplier**. When nutrients are calculated:
```
actualCalories = portionSize × nutrientProfile.calories
actualProtein  = portionSize × nutrientProfile.protein
... etc for all 16 nutrients
```

For example, logging 1.5x Paneer Butter Masala (350 cal per serving) = 525 calories.

---

### 4. Nutrition Analysis & Deficiency Detection

**File:** `NutrientAnalysisService.java`

This is the core analytics engine. When the user opens the Nutrition Analysis page:

**Step 1 — Aggregate:** Sum all nutrients from today's (or week's) dietary entries, accounting for portion sizes.

**Step 2 — Compare to RDA:** Each nutrient's total is compared against Recommended Daily Allowances:

| Nutrient | Daily RDA |
|----------|-----------|
| Calories | 2000 kcal |
| Protein | 50 g |
| Carbohydrates | 275 g |
| Fat | 78 g |
| Fiber | 28 g |
| Vitamin A | 900 mcg |
| Vitamin C | 90 mg |
| Vitamin D | 20 mcg |
| Calcium | 1000 mg |
| Iron | 18 mg |

**Step 3 — Calculate Overall Score:**
```
overallScore = average(each nutrient's percentage of RDA), capped at 100
```
Score of 80+ → "Good", 50-79 → "Needs Improvement", <50 → "Poor"

**Step 4 — Generate Recommendations:**
- If a nutrient is **< 50% of RDA** → **HIGH priority** recommendation
- If a nutrient is **< 80% of RDA** → **MEDIUM priority** recommendation
- Each recommendation includes: which nutrient is low, suggested foods to eat, and a rationale

**Example Response (simplified):**
```json
{
  "overallScore": 62,
  "totalCalories": 1450,
  "mealCount": 3,
  "macronutrients": [
    { "name": "Protein", "current": 35, "recommended": 50, "percentage": 70, "unit": "g" }
  ],
  "recommendations": [
    {
      "nutrient": "Protein",
      "priority": "MEDIUM",
      "message": "Increase protein intake",
      "suggestedFoods": ["Paneer Tikka", "Dal", "Chicken Curry"]
    }
  ]
}
```

---

### 5. AI NutriBot (Ollama Integration)

**Files:** `AiService.java`, `AiController.java`, `AiChat.jsx`

**How it works:**

```
User types message ──► Frontend sends POST /api/ai/chat
                         { message, userId, history[] }
                                    │
                                    ▼
                          AiService.chat()
                                    │
                  ┌─────────────────┴──────────────────┐
                  │  1. Fetch today's meals from DB      │
                  │  2. Build diet context string:        │
                  │     "Today you ate: Roti (2x, 240cal),│
                  │      Dal (1x, 180cal), ..."           │
                  │  3. Build system prompt:               │
                  │     "You are NutriBot, a friendly      │
                  │      nutrition assistant. Here is the  │
                  │      user's diet data: [context]"      │
                  │  4. Construct messages array:           │
                  │     [system, ...history, user message]  │
                  └─────────────────┬──────────────────┘
                                    │
                                    ▼
                    POST http://localhost:11434/api/chat
                    {
                      "model": "llama3.2:1b",
                      "messages": [...],
                      "stream": false
                    }
                                    │
                                    ▼
                         Ollama processes request
                         with local AI model
                                    │
                                    ▼
                    AiService parses response.message.content
                    Returns AiChatResponseDTO { reply, success }
                                    │
                                    ▼
                    Frontend displays reply in chat bubble
```

**NutriBot Persona (from system prompt):**
- Friendly, knowledgeable nutrition assistant
- Knows the user's today's diet (what they ate, calories, macros)
- Gives specific, actionable advice
- Suggests Indian foods from the database
- Responds concisely (2-3 paragraphs max)

**Error Handling:**
- If Ollama is not running → returns friendly message: "I'm having trouble connecting to my AI brain..."
- Frontend shows offline banner with setup instructions
- `GET /api/ai/status` endpoint for real-time availability check

---

### 6. Charts & Data Visualization

**Files:** `ChartDataService.java`, `ChartController.java`, `Charts.jsx`

**6 Chart Types:**

| # | Chart | Type (Recharts) | Shows |
|---|-------|-----------------|-------|
| 1 | **Calorie Trend** | AreaChart | Daily calorie intake over time (gradient fill) |
| 2 | **Daily Macros** | BarChart (stacked) | Protein / Carbs / Fat per day side by side |
| 3 | **Macro Split** | PieChart (donut) | Percentage breakdown of macronutrients |
| 4 | **Calories by Meal Type** | PieChart | Breakfast vs Lunch vs Dinner vs Snack distribution |
| 5 | **Nutrient Radar** | RadarChart | Spider chart of nutrient adequacy (% of RDA) |
| 6 | **Top Foods** | BarChart (horizontal) | Most consumed foods ranked by frequency/calories |

**Period selector:** User can toggle between 7, 14, and 30 days.

**Backend builds all 5 datasets in a single API call** (`GET /api/charts?userId=&days=`) to minimize network requests.

---

### 7. Goal Setting

**Files:** `NutritionGoal.java`, `NutritionGoalRepository.java`, `GoalController.java`, `GoalSettings.jsx`

**Default Goals** (created automatically when user first accesses):
| Nutrient | Default Target |
|----------|---------------|
| Calories | 2000 kcal |
| Protein | 50 g |
| Carbs | 300 g |
| Fat | 65 g |
| Fiber | 25 g |

**4 Preset Plans:**

| Preset | Calories | Protein | Carbs | Fat | Fiber |
|--------|----------|---------|-------|-----|-------|
| 🏃 Weight Loss | 1500 | 60 | 150 | 50 | 30 |
| ⚖️ Maintenance | 2000 | 50 | 250 | 65 | 25 |
| 💪 Muscle Building | 2500 | 120 | 300 | 80 | 30 |
| 🍛 Balanced Indian Diet | 2000 | 55 | 275 | 65 | 28 |

**Dashboard Integration:** The Dashboard page fetches goals from `GET /api/goals?userId=` and displays today's intake as a percentage of each goal target.

---

### 8. Dark Mode

**Files:** `ThemeContext.jsx`, `Layout.jsx`, `tailwind.config.js`, `index.css`

**How it works:**
1. `ThemeContext` reads from `localStorage` key `'theme'`
2. Falls back to `window.matchMedia('(prefers-color-scheme: dark)')` (system preference)
3. Toggles the `'dark'` class on `document.documentElement` (`<html>` tag)
4. Tailwind CSS uses `darkMode: 'class'` strategy — all components use `dark:` prefix variants
5. Toggle button in sidebar (`Layout.jsx`) — sun/moon icon with animation
6. Persists choice in `localStorage` across sessions

**Example Tailwind dark mode usage:**
```jsx
<div className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">
```

---

### 9. User Profile & Account Management

**Files:** `AuthController.java`, `UserProfile.jsx`

| Feature | How It Works |
|---------|-------------|
| **View Profile** | `GET /api/auth/profile?userId=` → displays username, email, age, member since date |
| **Edit Profile** | `PUT /api/auth/profile?userId=` → updates email and/or age |
| **Change Password** | `PUT /api/auth/change-password?userId=` → verifies current password with BCrypt, hashes new password, saves |
| **Delete Account** | `DELETE /api/auth/account?userId=` → `@Transactional` cascade: deletes NutritionGoal → DietaryEntries → User |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Port 8080 in use** | Change `server.port` in `application.properties` |
| **MySQL connection refused** | Ensure MySQL is running: `net start mysql` (Windows) or `sudo systemctl start mysql` (Linux) |
| **Access denied for root** | Verify password in `application.properties` matches your MySQL password |
| **Frontend 401 errors** | Token may have expired (24h). Log out and log back in. |
| **Tables not created** | Ensure `spring.jpa.hibernate.ddl-auto=update` in `application.properties` |
| **`mvn` not recognized (Windows)** | Use `mvn.cmd` or add Maven to PATH. Full path: `& "C:\Program Files\Maven\apache-maven-3.9.12\bin\mvn.cmd"` |
| **Foods not showing** | Check that `DataInitializer` ran (look for "Initialized X food items" in console). If foods exist but are old version, bump `SEED_VERSION` |
| **NutriBot says "Offline"** | Run `ollama serve` in a terminal, then check `ollama list` to confirm model is downloaded |
| **Ollama model not found** | Run `ollama pull llama3.2:1b` to download the model |
| **Charts show empty** | You need to have logged some meals first. Charts require dietary entry data. |
| **CORS errors in browser** | Make sure frontend is running on `localhost:5173` (configured in `SecurityConfig.java`) |
| **Slow first AI response** | First request loads the model into memory. Subsequent requests are much faster. |

---

## 📝 Configuration Reference

**Backend** (`src/main/resources/application.properties`):

| Property | Default | Description |
|----------|---------|-------------|
| `server.port` | `8080` | Backend API port |
| `spring.datasource.url` | `jdbc:mysql://localhost:3306/nutrition_db` | MySQL connection URL |
| `spring.datasource.username` | `root` | MySQL username |
| `spring.datasource.password` | `root` | MySQL password |
| `spring.jpa.hibernate.ddl-auto` | `update` | Auto-create/update tables on startup |
| `jwt.secret` | *(32+ char string)* | Secret key for signing JWT tokens |
| `jwt.expiration` | `86400000` | Token validity (24 hours in milliseconds) |
| `ollama.base-url` | `http://localhost:11434` | Ollama server URL |
| `ollama.model` | `llama3.2:1b` | AI model to use for NutriBot |

**Frontend** (`frontend/.env` or environment):

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080` | Backend API base URL |

---

## 📝 License

This project is for educational purposes — **FSAD (Full Stack Application Development) course project**.

---

## 🏗 Summary for Jury

This project demonstrates a **complete full-stack application** covering:

1. **Backend Engineering** — Spring Boot REST API with 8 controllers, 6 services, 6 repositories, 20 model classes, 13 DTOs, JWT security, and AI integration
2. **Frontend Engineering** — React SPA with 10 pages, Tailwind CSS design system, dark mode, interactive charts, and responsive layout
3. **Database Design** — Normalized MySQL schema with proper entity relationships (One-to-One, One-to-Many, Many-to-One)
4. **Security** — Industry-standard JWT authentication, BCrypt password hashing, stateless sessions, auto-logout on token expiry
5. **AI Integration** — Local Ollama LLM providing context-aware nutrition advice using the user's actual diet data
6. **Data Visualization** — 6 chart types using Recharts with configurable time periods
7. **Domain Knowledge** — 111 Indian foods with real nutritional data (16 nutrients each), RDA-based deficiency detection, and goal tracking

**Total codebase:** ~8,000+ lines across 60+ files, with a clean separation of concerns between presentation, business logic, and data layers.
