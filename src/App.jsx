import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ExploreGrounds from './pages/ExploreGrounds';
import BookGround from './pages/BookGround';
import MyBookings from './pages/MyBookings';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return sessionStorage.getItem('playslot_user') || null;
  });

  const handleLoginSuccess = (user) => {
    sessionStorage.setItem('playslot_user', user);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('playslot_user');
    setCurrentUser(null);
  };

  return (
    <div className="app-container">
      {currentUser && <Navbar username={currentUser} onLogout={handleLogout} />}

      <Routes>
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        <Route
          path="/"
          element={
            currentUser ? (
              <Dashboard username={currentUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/explore"
          element={
            currentUser ? (
              <ExploreGrounds />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/book/:id"
          element={
            currentUser ? (
              <BookGround username={currentUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/my-bookings"
          element={
            currentUser ? (
              <MyBookings username={currentUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
