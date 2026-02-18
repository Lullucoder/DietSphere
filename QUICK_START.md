# 🚀 Quick Start Guide - Diet Balance Tracker MVP

## ✅ What's Been Built

### Backend (Spring Boot)
- ✅ User registration & login with JWT
- ✅ Food search functionality
- ✅ Meal logging system
- ✅ 10 sample foods pre-loaded
- ✅ MySQL database integration

### Frontend (React + Vite)
- ✅ Beautiful login/register pages
- ✅ Dashboard showing today's calories
- ✅ Food search and logging interface
- ✅ Meal history view
- ✅ Responsive, modern UI

## 🎯 Features Implemented

1. **User Authentication** 🔐
   - Register new account
   - Login with username/password
   - JWT token-based auth

2. **Food Logging** 🍎
   - Search from 10 pre-loaded foods
   - Select portion size
   - Choose meal type (Breakfast/Lunch/Dinner/Snack)
   - Log meals instantly

3. **Nutrition Dashboard** 📊
   - View today's total calories
   - See all meals logged today
   - Track meal count
   - Quick access to log new meals

## 🏃 How to Run

### Step 1: Set Up MySQL Database

```sql
-- Open MySQL and run:
CREATE DATABASE nutrition_db;
```

### Step 2: Configure Database

Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Step 3: Run Backend

```bash
# In project root directory
mvn spring-boot:run
```

Wait for: "Started DietBalanceTrackerApplication"
Backend will be at: http://localhost:8080

### Step 4: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 5: Run Frontend

```bash
# In frontend directory
npm run dev
```

Frontend will be at: http://localhost:5173

## 🎨 Using the Application

### 1. Register an Account
- Go to http://localhost:5173
- Click "Register here"
- Fill in: username, email, password, age
- Click "Register"

### 2. View Dashboard
- See your today's calories (starts at 0)
- View meals logged today
- Click "Log New Meal" button

### 3. Log a Meal
- Search for food (try: "apple", "chicken", "rice")
- Click on a food to select it
- Enter portion size (e.g., 1.5 for 1.5 servings)
- Choose meal type
- Click "Log This Meal"

### 4. View History
- Click "History" in navigation
- See all your logged meals
- View dates, times, and calories

## 📦 Pre-loaded Foods

The database comes with 10 foods:
1. Apple 🍎
2. Banana 🍌
3. Chicken Breast 🍗
4. Brown Rice 🍚
5. Broccoli 🥦
6. Milk 🥛
7. Egg 🥚
8. Salmon 🐟
9. Spinach 🥬
10. Almonds 🥜

## 🎓 For Classroom Demo

### What to Show:

1. **Registration Flow**
   - "Users can create accounts with basic info"
   - Show the form validation

2. **Food Logging**
   - "Users search for foods from our database"
   - "They can specify how much they ate"
   - "System calculates calories automatically"

3. **Dashboard**
   - "Dashboard shows today's nutrition summary"
   - "Users can see all their meals"
   - "Color-coded, easy to understand"

### Code to Explain:

1. **Backend Architecture**
   - Entities (User, FoodItem, DietaryEntry)
   - Repositories (talk to database)
   - Services (business logic)
   - Controllers (REST API)

2. **Frontend Structure**
   - React components
   - Axios for API calls
   - React Router for navigation
   - State management with useState

3. **Security**
   - Password hashing with BCrypt
   - JWT tokens for authentication
   - CORS configuration

## 🐛 Troubleshooting

### Backend won't start
- Check MySQL is running
- Verify database credentials in application.properties
- Ensure port 8080 is not in use

### Frontend won't start
- Run `npm install` in frontend directory
- Check port 5173 is not in use
- Verify Node.js is installed

### Can't log in
- Make sure backend is running
- Check browser console for errors
- Verify you registered first

### No foods showing
- Backend should auto-create 10 foods on first run
- Check backend logs for errors
- Verify database connection

## 📝 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Foods
- GET `/api/foods/search?query=apple` - Search foods

### Dietary Entries
- POST `/api/entries?userId=1` - Log a meal
- GET `/api/entries?userId=1` - Get all meals
- GET `/api/entries/today?userId=1` - Get today's meals

## 🎉 Success!

If you can:
1. ✅ Register and login
2. ✅ Search for foods
3. ✅ Log a meal
4. ✅ See it on dashboard

**Your MVP is working perfectly!** 🎊

## 💡 Tips for Presentation

- Keep it simple - focus on the 3 core features
- Show the flow: Register → Login → Log Food → View Dashboard
- Explain the code is well-commented for learning
- Mention it's production-ready but simplified for education
- Highlight the clean UI and user experience

Good luck with your demo! 🚀
