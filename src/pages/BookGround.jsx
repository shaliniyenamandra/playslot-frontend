import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function BookGround({ username }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ground, setGround] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  // Form states
  const todayStr = new Date().toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState(todayStr);
  const [selectedSlot, setSelectedSlot] = useState('');

  useEffect(() => {
    async function fetchGround() {
      try {
        setLoading(true);
        const data = await api.getGroundById(id);
        setGround(data);
        if (data?.availableSlots?.length > 0) {
          setSelectedSlot(data.availableSlots[0]);
        }
      } catch (err) {
        setError('Failed to fetch ground details: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGround();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError('Please select a time slot.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const bookingData = {
        username: username,
        groundId: ground.id,
        bookingDate: bookingDate,
        timeSlot: selectedSlot
      };

      const result = await api.createBooking(bookingData);
      setSuccessBooking(result);
    } catch (err) {
      setError(err.message || 'Booking failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center', color: '#94a3b8' }}>
        Loading ground details from backend...
      </div>
    );
  }

  if (!ground) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Ground not found</h2>
        <button onClick={() => navigate('/explore')} className="btn-primary" style={{ marginTop: '1rem' }}>
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      <div className="booking-container">
        {successBooking ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontSize: '1.8rem', color: '#34d399', marginBottom: '0.5rem' }}>
              Booking Confirmed Successfully!
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
              Your reservation reference has been recorded in the Java in-memory store.
            </p>

            <div style={{
              background: '#1c2541',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'left',
              marginBottom: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: '#94a3b8' }}>Reference ID:</span>
                <strong style={{ color: '#34d399' }}>{successBooking.referenceNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: '#94a3b8' }}>Ground:</span>
                <span>{successBooking.groundName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: '#94a3b8' }}>Sport & Location:</span>
                <span>{successBooking.sport} • {successBooking.location}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: '#94a3b8' }}>Date & Slot:</span>
                <span>{successBooking.bookingDate} ({successBooking.timeSlot})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Total Amount:</span>
                <strong style={{ color: '#34d399' }}>₹{successBooking.amount.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => navigate('/my-bookings')} className="btn-primary">
                View in My Bookings
              </button>
              <button onClick={() => navigate('/explore')} className="btn-secondary">
                Book Another Ground
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="booking-header">
              <span className="ground-sport-tag" style={{ position: 'static' }}>{ground.sport}</span>
              <h2 style={{ fontSize: '1.8rem', marginTop: '0.75rem', marginBottom: '0.3rem' }}>
                {ground.name}
              </h2>
              <div className="ground-location" style={{ marginBottom: '0.5rem' }}>
                📍 {ground.location}
              </div>
              <div className="ground-price">
                ₹{ground.hourlyPrice.toLocaleString()} <span>per hour session</span>
              </div>
            </div>

            {error && (
              <div className="alert-box alert-danger">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label className="form-label">Booking Date</label>
                <input
                  type="date"
                  className="form-input"
                  min={todayStr}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Select Time Slot</label>
                <div className="slots-grid">
                  {ground.availableSlots?.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                color: '#94a3b8'
              }}>
                ℹ️ <strong>Demo notice:</strong> No payment required. Submitting this form directly records your reserved slot in the backend memory.
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '0.85rem' }}
                  disabled={submitting}
                >
                  {submitting ? 'Confirming...' : 'Confirm Booking'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/explore')}
                  className="btn-secondary"
                  style={{ padding: '0.85rem 1.5rem' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
