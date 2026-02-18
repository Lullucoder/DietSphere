import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import FoodLogging from './pages/FoodLogging'
import MealHistory from './pages/MealHistory'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" /> : <RegisterPage onRegister={handleLogin} />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/log-food" 
            element={user ? <FoodLogging user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/history" 
            element={user ? <MealHistory user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
