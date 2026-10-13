import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter non-empty username and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      // Call Java Spring Boot backend login endpoint
      const result = await api.login(username.trim(), password.trim());
      if (result && result.success) {
        onLoginSuccess(result.username);
        navigate('/');
      } else {
        setError(result?.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #1c2541 0%, #0b132b 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: '#1f2d5a',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚡</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
            PlaySlot
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            Sports Ground Booking Management System
          </p>
        </div>

        {/* Demo instructions banner */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.75rem',
          fontSize: '0.9rem',
          lineHeight: '1.5'
        }}>
          <div style={{ color: '#34d399', fontWeight: 700, marginBottom: '0.3rem' }}>
            DEMO LOGIN — Enter any username and password to continue.
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
            Example credentials:<br/>
            <strong>Username:</strong> <code style={{ color: '#a7f3d0' }}>admin</code><br/>
            <strong>Password:</strong> <code style={{ color: '#a7f3d0' }}>admin123</code>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', fontStyle: 'italic' }}>
            * This is demo authentication for college project evaluation, not production security. Any non-empty credentials work.
          </div>
        </div>

        {error && (
          <div className="alert-box alert-danger">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. admin or your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="e.g. admin123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In to PlaySlot'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.8rem' }}>
          Spring Boot 3 REST API + React.js & Vite
        </div>
      </div>
    </div>
  );
}
