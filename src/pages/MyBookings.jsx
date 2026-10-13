import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function MyBookings({ username }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getUserBookings(username);
      setBookings(data || []);
    } catch (err) {
      setError('Failed to fetch bookings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [username]);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancellingId(id);
      await api.cancelBooking(id);
      setMessage('Booking cancelled successfully.');
      // Refresh list
      await fetchBookings();
    } catch (err) {
      setError('Failed to cancel booking: ' + err.message);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">My Bookings</h1>
          <p className="section-desc">Manage your reservations for {username}</p>
        </div>
        <button onClick={() => navigate('/explore')} className="btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
          + New Booking
        </button>
      </div>

      {message && (
        <div className="alert-box alert-success">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="alert-box alert-danger">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          Loading your bookings from Spring Boot API...
        </div>
      ) : bookings.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 1rem',
          background: 'rgba(31, 45, 90, 0.4)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Bookings Found</h3>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            You haven't reserved any sports grounds yet. Explore our venues to book your first session!
          </p>
          <button onClick={() => navigate('/explore')} className="btn-primary">
            Explore Grounds Now
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((b) => (
            <div key={b.id} className="booking-item-card">
              <div style={{ flex: '1 1 280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <span className="ground-sport-tag" style={{ position: 'static' }}>{b.sport}</span>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Ref: <strong>{b.referenceNumber}</strong></span>
                  <span className={`status-badge ${b.status === 'CONFIRMED' ? 'status-confirmed' : 'status-cancelled'}`}>
                    {b.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0.3rem 0' }}>{b.groundName}</h3>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  📍 {b.location}
                </div>
              </div>

              <div style={{ flex: '1 1 200px' }}>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <strong>Date:</strong> {b.bookingDate}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                  <strong>Slot:</strong> {b.timeSlot}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>
                  Booked at: {b.createdAt}
                </div>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#34d399' }}>
                  ₹{b.amount.toLocaleString()}
                </div>
                {b.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleCancelBooking(b.id)}
                    className="logout-btn"
                    disabled={cancellingId === b.id}
                    style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}
                  >
                    {cancellingId === b.id ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '2.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
        * Note: Reservations are stored in Java in-memory collections and persist while the backend is running.
      </div>
    </div>
  );
}
