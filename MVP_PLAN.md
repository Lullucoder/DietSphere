# MVP Implementation Plan - Simplified

## 🎯 Core Features (Only 3)

### Feature 1: User Registration & Login
- Simple registration form
- Login with JWT authentication
- Store user session

### Feature 2: Food Logging
- Search for foods from database
- Log what you ate with portion size
- View your meal history

### Feature 3: Nutrition Dashboard
- Show today's total calories
- Display recent meals
- Simple color-coded nutrition status

## 📋 What We'll Build

### Backend (Minimal)
1. ✅ Entities (Already done!)
2. **Repositories** (5 simple interfaces)
3. **Services** (3 core services)
4. **Controllers** (3 REST endpoints)
5. **Security** (Basic JWT)

### Frontend (Nice UI)
1. **Login/Register Page** - Clean, modern design
2. **Dashboard** - Show nutrition summary
3. **Food Logging** - Search and add meals
4. **Meal History** - List of recent entries

## 🚀 Implementation Steps

### Step 1: Repositories (5 files)
- UserRepository
- HealthDataRepository
- FoodItemRepository
- NutrientProfileRepository
- DietaryEntryRepository

### Step 2: DTOs (3 files)
- UserRegistrationDTO
- LoginDTO
- DietaryEntryDTO

### Step 3: Services (3 files)
- UserService (register, login)
- FoodItemService (search foods)
- DietaryEntryService (log meals, get history)

### Step 4: Security (2 files)
- JwtTokenProvider
- SecurityConfig

### Step 5: Controllers (3 files)
- AuthController (register, login)
- FoodController (search)
- DietaryEntryController (log, history)

### Step 6: Sample Data (1 file)
- DataInitializer (add sample foods to database)

### Step 7: React Frontend (Nice UI)
- Modern, colorful design
- Easy to navigate
- Mobile-responsive
- Clear visual feedback

## 🎨 UI Design

### Color Scheme
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Orange (#F59E0B)
- Danger: Red (#EF4444)
- Background: Light gray (#F3F4F6)

### Pages
1. **Login/Register** - Split screen design
2. **Dashboard** - Cards showing stats
3. **Food Search** - Search bar with results
4. **Meal History** - Timeline view

## ⏱️ Estimated Time
- Backend: ~30 minutes
- Frontend: ~30 minutes
- **Total: ~1 hour**

## 🎓 Perfect for Classroom Demo

Easy to explain:
1. "Users register and login" → Show login page
2. "Users search and log food" → Show food search
3. "System calculates nutrition" → Show dashboard

Simple, visual, and functional!
