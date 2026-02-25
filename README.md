# Diet Balance Nutrient Tracker 🥗

A full-stack web application for tracking dietary habits and detecting nutrient deficiencies. Built with **Java 21 + Spring Boot 3.2** (backend) and **React 18 + Vite** (frontend).

## 📋 What Does This Application Do?

- **Track meals** — Log breakfast, lunch, dinner & snacks with portion sizes
- **Analyze nutrition** — View macro & micronutrient intake vs. recommended daily values
- **Detect deficiencies** — Color-coded nutrient bars highlight gaps
- **Get recommendations** — Personalized food suggestions based on deficiencies
- **Manage profile** — Update email, age; view activity stats

## 🛠️ Technology Stack

### Backend
- **Java 21** — Latest LTS release
- **Spring Boot 3.2** — REST API framework
- **Spring Security 6 + JWT** — Stateless authentication with Bearer tokens
- **Spring Data JPA / Hibernate 6** — ORM for MySQL
- **MySQL 8** — Relational database
- **Lombok** — Reduces boilerplate code
- **Maven** — Build & dependency management

### Frontend
- **React 18** — Component-based UI
- **Vite 5** — Fast dev server & bundler
- **React Router 6** — Client-side routing
- **Axios** — HTTP client with JWT interceptor

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| **Java (JDK)** | 21+ | `java -version` |
| **Maven** | 3.9+ | `mvn -version` |
| **MySQL** | 8.0+ | `mysql --version` |
| **Node.js** | 18+ | `node -v` |
| **npm** | 9+ | `npm -v` |

### Step 1 — Set Up MySQL Database

```sql
-- Open MySQL CLI or MySQL Workbench and run:
CREATE DATABASE IF NOT EXISTS nutrition_db;
```

The app uses `root` / `root` by default. Edit `src/main/resources/application.properties` if your credentials differ:
```properties
spring.datasource.username=root
spring.datasource.password=root
```

### Step 2 — Run the Backend

```bash
cd <project-root>
mvn spring-boot:run
```

Wait for: `Started DietBalanceTrackerApplication`  
Backend available at: **http://localhost:8080**

> On first run the app auto-creates tables and seeds 10 food items with real USDA nutrient data.

### Step 3 — Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend available at: **http://localhost:5173**

## 📁 Project Structure

```
FSAD-Project/
├── src/main/java/com/nutrition/dietbalancetracker/
│   ├── controller/       # REST endpoints (Auth, Entries, Food, Analysis, Health)
│   ├── service/          # Business logic (User, DietaryEntry, FoodItem, NutrientAnalysis)
│   ├── repository/       # Spring Data JPA repositories
│   ├── model/            # JPA entities (User, FoodItem, NutrientProfile, DietaryEntry, …)
│   ├── dto/              # Request/response DTOs
│   ├── config/           # DataInitializer (seeds sample data)
│   └── security/         # JWT filter, Spring Security config
│
├── src/main/resources/
│   └── application.properties
│
├── frontend/
│   └── src/
│       ├── services/api.js          # Centralized Axios instance + JWT interceptor
│       ├── components/Layout.jsx    # Shared navbar & layout wrapper
│       └── pages/                   # LoginPage, RegisterPage, Dashboard,
│                                    # FoodLogging, MealHistory,
│                                    # NutritionAnalysis, UserProfile
│
├── pom.xml
└── README.md
```

## 🔒 Authentication Flow

1. User registers or logs in → server returns JWT token
2. Token stored in `localStorage`
3. Every API request includes `Authorization: Bearer <token>` header (via Axios interceptor)
4. `JwtAuthenticationFilter` validates the token on every request
5. On 401, user is auto-redirected to login

## 📊 API Endpoints

### Authentication (`/api/auth` — public)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/profile?userId=` | Get user profile |
| PUT | `/api/auth/profile?userId=` | Update email / age |

### Food Items (`/api/foods` — authenticated)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/foods/search?query=` | Search food database |

### Dietary Entries (`/api/entries` — authenticated)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/entries?userId=` | Log a meal |
| GET | `/api/entries?userId=` | Full meal history |
| GET | `/api/entries/today?userId=` | Today's meals |
| DELETE | `/api/entries/{id}?userId=` | Delete an entry |

### Nutrient Analysis (`/api/analysis` — authenticated)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/analysis/today?userId=` | Today's nutrient breakdown |
| GET | `/api/analysis/week?userId=` | 7-day average analysis |

### Health Check (`/api/health` — public)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Server status |

## 🎯 Key Features

- ✅ Secure registration & login with JWT
- ✅ Log meals with food search, portion size & meal type
- ✅ View meal history grouped by date, with delete support
- ✅ Dashboard with calorie progress & macro breakdown
- ✅ Nutrient analysis with 15+ micro/macronutrients vs. RDA
- ✅ Color-coded deficiency indicators (green/amber/red)
- ✅ Personalized food recommendations for deficient nutrients
- ✅ Shared navigation with active link highlighting
- ✅ Auto-seeded food database with real USDA nutrient values
- ✅ User profile management

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 8080 in use | Change `server.port` in `application.properties` |
| MySQL connection refused | Ensure MySQL is running: `net start mysql` (Windows) |
| Access denied for `root` | Verify password in `application.properties` matches MySQL |
| Frontend 401 errors | Make sure you're logged in; token may have expired (24h) |
| Tables not created | Set `spring.jpa.hibernate.ddl-auto=update` in properties |

## 📝 License

This project is for educational purposes (FSAD course project).

