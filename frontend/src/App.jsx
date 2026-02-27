import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster }  from 'react-hot-toast';

import Layout       from './components/Layout';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard    from './pages/Dashboard';
import FoodLogging  from './pages/FoodLogging';
import MealHistory  from './pages/MealHistory';
import Nutrition    from './pages/Nutrition';
import Charts       from './pages/Charts';
import Goals        from './pages/Goals';
import Profile      from './pages/Profile';
import AiChat       from './pages/AiChat';

import './App.css';

export default function App() {
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem('user');
    return s ? JSON.parse(s) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = (data) => {
    const u = { ...data, id: data.userId ?? data.id };
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const ProtectedRoute = ({ children }) =>
    user ? <Layout user={user} onLogout={logout}>{children}</Layout> : <Navigate to="/login" />;

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage onLogin={login} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage onRegister={login} />} />
        <Route path="/" element={<ProtectedRoute><Dashboard user={user} /></ProtectedRoute>} />
        <Route path="/log" element={<ProtectedRoute><FoodLogging user={user} /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><MealHistory user={user} /></ProtectedRoute>} />
        <Route path="/nutrition" element={<ProtectedRoute><Nutrition user={user} /></ProtectedRoute>} />
        <Route path="/charts" element={<ProtectedRoute><Charts user={user} /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals user={user} /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile user={user} onLogout={logout} /></ProtectedRoute>} />
        <Route path="/ai" element={<ProtectedRoute><AiChat user={user} /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
