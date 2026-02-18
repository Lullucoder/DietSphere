# Diet Balance Nutrient Tracker 🥗

A web application designed to help children and adolescents track their dietary habits and detect nutrient deficiencies. Built with Java Spring Boot backend and React frontend.

## 📋 What Does This Application Do?

This application helps users:
- **Track what they eat** - Log meals and snacks throughout the day
- **Analyze nutrition** - Automatically calculate nutrient intake
- **Detect deficiencies** - Identify when important nutrients are missing
- **Get recommendations** - Receive personalized food suggestions
- **Monitor progress** - View trends and reports over time

## 🛠️ Technology Stack

### Backend
- **Java 17** - The programming language
- **Spring Boot 3.2** - Framework that makes building web apps easier
- **PostgreSQL** - Database where we store all the data
- **Spring Security + JWT** - Handles user login and security
- **Maven** - Tool that manages dependencies and builds the project

### Frontend
- **React** - JavaScript library for building user interfaces
- **Vite** - Fast build tool for modern web development
- **Axios** - Makes HTTP requests to our backend API
- **React Router** - Handles navigation between pages

## 🚀 Getting Started

### Prerequisites (What You Need Installed)

1. **Java 17 or higher**
   - Check if installed: `java -version`
   - Download from: https://adoptium.net/

2. **Maven**
   - Check if installed: `mvn -version`
   - Download from: https://maven.apache.org/download.cgi

3. **PostgreSQL Database**
   - Check if installed: `psql --version`
   - Download from: https://www.postgresql.org/download/

4. **Node.js and npm** (for frontend)
   - Check if installed: `node -version` and `npm -version`
   - Download from: https://nodejs.org/

### Step 1: Set Up the Database

1. Open PostgreSQL command line or pgAdmin
2. Create a new database:
   ```sql
   CREATE DATABASE nutrition_db;
   ```
3. The application will automatically create all the tables when it starts!

### Step 2: Configure the Application

1. Open `src/main/resources/application.properties`
2. Update these lines with your database credentials:
   ```properties
   spring.datasource.username=your_postgres_username
   spring.datasource.password=your_postgres_password
   ```

### Step 3: Run the Backend

1. Open terminal in the project root directory
2. Run this command:
   ```bash
   mvn spring-boot:run
   ```
3. Wait for the message: "Started DietBalanceTrackerApplication"
4. The backend is now running at: http://localhost:8080

### Step 4: Run the Frontend (Coming Soon)

Instructions will be added when we implement the React frontend.

## 📁 Project Structure

```
diet-balance-tracker/
│
├── src/main/java/com/nutrition/dietbalancetracker/
│   ├── controller/          # REST API endpoints (handles HTTP requests)
│   ├── service/             # Business logic (the "brain" of the app)
│   ├── repository/          # Database access (talks to PostgreSQL)
│   ├── model/               # Data models (User, FoodItem, etc.)
│   ├── dto/                 # Data Transfer Objects (for API requests/responses)
│   ├── config/              # Configuration classes (security, etc.)
│   ├── security/            # Security-related code (JWT, authentication)
│   └── util/                # Utility classes (helper functions)
│
├── src/main/resources/
│   └── application.properties    # Configuration file
│
├── src/test/                # Test files
│
├── frontend/                # React application (coming soon)
│
├── pom.xml                  # Maven configuration (lists all dependencies)
└── README.md               # This file!
```

## 🎯 Key Features

### For Users
- ✅ Create account and log in securely
- ✅ Log daily food intake with portion sizes
- ✅ View nutrient analysis dashboard
- ✅ Receive personalized food recommendations
- ✅ Get alerts for nutrient deficiencies
- ✅ Generate nutrition reports

### For Admins
- ✅ Manage food database
- ✅ Configure nutrient thresholds
- ✅ View system-wide statistics
- ✅ Monitor users with critical deficiencies

## 🔒 Security Features

- Passwords are encrypted (never stored as plain text)
- JWT tokens for secure authentication
- Role-based access control (User vs Admin)
- Data encryption at rest
- HTTPS support for production

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Log in and get token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Dietary Entries
- `POST /api/dietary-entries` - Log a meal
- `GET /api/dietary-entries` - Get your meal history
- `PUT /api/dietary-entries/{id}` - Update a meal
- `DELETE /api/dietary-entries/{id}` - Delete a meal

### Analysis
- `GET /api/analysis/current` - Get current nutrient status
- `GET /api/analysis/history` - Get historical trends

### Recommendations
- `GET /api/recommendations` - Get food suggestions

(More endpoints will be added as we implement features)

## 🧪 Running Tests

```bash
# Run all tests
mvn test

# Run tests with coverage report
mvn test jacoco:report
```

## 🐛 Troubleshooting

### "Port 8080 is already in use"
- Another application is using port 8080
- Solution: Change the port in `application.properties`:
  ```properties
  server.port=8081
  ```

### "Could not connect to database"
- PostgreSQL is not running
- Solution: Start PostgreSQL service
  - Windows: Open Services and start PostgreSQL
  - Mac: `brew services start postgresql`
  - Linux: `sudo systemctl start postgresql`

### "Access denied for user"
- Wrong database username or password
- Solution: Check credentials in `application.properties`

## 📚 Learning Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [REST API Best Practices](https://restfulapi.net/)

## 👥 For Classroom Presentation

This project is designed to be easy to explain:
- **Clear separation of concerns** - Each class has one job
- **Extensive comments** - Every line is explained
- **Standard patterns** - Uses industry-standard practices
- **Step-by-step implementation** - Built incrementally

## 📝 License

This project is for educational purposes.

## 🤝 Contributing

This is a class project. Contributions are welcome from team members!

---

**Need Help?** Check the comments in the code - they explain everything in detail!
