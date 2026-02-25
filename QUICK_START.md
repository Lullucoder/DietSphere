# Quick Start Guide — Diet Balance Nutrient Tracker

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| JDK | 21 | https://adoptium.net/ |
| Maven | 3.9+ | https://maven.apache.org/ |
| MySQL | 8.0+ | https://dev.mysql.com/downloads/ |
| Node.js | 18+ | https://nodejs.org/ |

## 1. Create the MySQL Database

```sql
CREATE DATABASE IF NOT EXISTS nutrition_db;
```

Default credentials in `application.properties`: **root / root**  
Change them if your MySQL setup differs.

## 2. Start the Backend

```bash
cd <project-root>
mvn spring-boot:run
```

Wait for `Started DietBalanceTrackerApplication` in the console.  
Backend: **http://localhost:8080**

> First run auto-creates all tables and seeds 10 foods with real USDA nutrient data.

## 3. Start the Frontend

```bash
cd frontend
npm install      # first time only
npm run dev
```

Frontend: **http://localhost:5173**

---

## Using the Application

### Register & Login
1. Open http://localhost:5173
2. Click **Register here** → fill in username, email, password, age → submit
3. You are automatically logged in and redirected to the Dashboard

### Dashboard
- Shows today's calorie count + progress bar
- Displays macronutrient totals (Protein / Carbs / Fat)
- Quick links to Log Food and Nutrition Analysis

### Log a Meal
1. Click **Log Food** in the navbar
2. Type a food name to search (e.g. "chicken", "banana")
3. Click a food item → see its nutrient breakdown
4. Choose portion size and meal type → **Log This Meal**

### Meal History
- Click **History** in the navbar
- Meals are grouped by date with macro breakdown
- Click **Delete** to remove any entry

### Nutrition Analysis
- Click **Nutrition** in the navbar
- Toggle **Today** / **This Week**
- See macro & micronutrient bars vs. recommended daily values
  - Green ≥ 80% — on track
  - Amber ≥ 50% — needs improvement
  - Red < 50% — deficient
- Personalized food recommendations below

### User Profile
- Click **Profile** in the navbar
- View account info and activity stats
- Edit email or age

---

## Pre-loaded Foods (10 items, real USDA data)

| Food | Calories | Protein | Category |
|------|----------|---------|----------|
| Apple | 95 | 0.5 g | Fruit |
| Banana | 105 | 1.3 g | Fruit |
| Chicken Breast | 165 | 31 g | Protein |
| Brown Rice | 216 | 5 g | Grain |
| Broccoli | 55 | 3.7 g | Vegetable |
| Milk | 149 | 7.7 g | Dairy |
| Egg | 78 | 6.3 g | Protein |
| Salmon | 206 | 22 g | Protein |
| Spinach | 7 | 0.9 g | Vegetable |
| Almonds | 164 | 6 g | Nut/Seed |

All items include full micronutrient data (vitamins A, C, D, E, K, B12 + calcium, iron, magnesium, zinc, potassium).

---

## API Endpoints

### Public (no token required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login → JWT |
| GET | `/api/auth/profile?userId=` | Profile |
| PUT | `/api/auth/profile?userId=` | Update profile |
| GET | `/api/health` | Health check |

### Authenticated (Bearer token required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/foods/search?query=` | Search foods |
| POST | `/api/entries?userId=` | Log meal |
| GET | `/api/entries?userId=` | Meal history |
| GET | `/api/entries/today?userId=` | Today's meals |
| DELETE | `/api/entries/{id}?userId=` | Delete entry |
| GET | `/api/analysis/today?userId=` | Today's analysis |
| GET | `/api/analysis/week?userId=` | Weekly analysis |

---

## Jury Demo Script (recommended flow)

1. **Register** a new user — show form validation
2. **Log 3-4 meals** — search foods, select portions, different meal types
3. **Dashboard** — point out calorie progress + macros
4. **Nutrition Analysis (Today)** — show bars, color coding, recommendations
5. **Switch to Week view** — demonstrate averaging logic
6. **History** — show grouped-by-date view, delete an entry
7. **Profile** — show stats, edit age
8. **Code walkthrough** — explain MVC layers, JWT flow, React component structure

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 8080 in use | `server.port=8081` in application.properties |
| MySQL connection refused | Start MySQL: `net start mysql` |
| Access denied | Check username/password in application.properties |
| Foods not appearing | Backend must be running; check for startup errors |
| 401 on API calls | Login again — token expires after 24 hours |
