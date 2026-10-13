import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ username, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="demo-banner">
        ⚡ <strong>PlaySlot College Demo Mode</strong> — Connected to Java Spring Boot REST API
      </div>
      <nav className="navbar">
        <div className="container nav-container">
          <Link to="/" className="nav-brand">
            <span className="brand-icon">⚡</span>
            <span>PlaySlot</span>
            <span className="brand-badge">College Demo</span>
          </Link>

          <div className="nav-links">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/explore" className={`nav-link ${isActive('/explore') ? 'active' : ''}`}>
              Explore Grounds
            </Link>
            <Link to="/my-bookings" className={`nav-link ${isActive('/my-bookings') ? 'active' : ''}`}>
              My Bookings
            </Link>
          </div>

          <div className="nav-user">
            <span className="user-badge">👤 {username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
