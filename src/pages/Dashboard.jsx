import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Dashboard({ username }) {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSports() {
      try {
        setLoading(true);
        const data = await api.getSports();
        setSports(data || []);
      } catch (err) {
        setError('Failed to load sports from Java backend: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSports();
  }, []);

  const handleExploreSport = (sportName) => {
    navigate(`/explore?sport=${encodeURIComponent(sportName)}`);
  };

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      <section className="hero">
        <h1 className="hero-title">Welcome to PlaySlot</h1>
        <p className="hero-subtitle">
          Book your favourite sports grounds easily. Seamless scheduling for Cricket, Football, Badminton, and Basketball turfs across Hyderabad.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/explore')} className="btn-primary">
            Explore All Grounds
          </button>
          <button onClick={() => navigate('/my-bookings')} className="btn-secondary">
            View My Bookings
          </button>
        </div>
      </section>

      <section className="sports-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Select Your Sport</h2>
            <p className="section-desc">Choose from our premium managed sports facilities</p>
          </div>
        </div>

        {error && (
          <div className="alert-box alert-danger">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            Loading sports categories from Spring Boot API...
          </div>
        ) : (
          <div className="sports-grid">
            {sports.map((sport) => (
              <div key={sport.id} className="sport-card">
                <div className="sport-img-wrapper">
                  <img src={sport.imageUrl} alt={sport.name} className="sport-img" />
                  <span className="sport-icon-badge">{sport.icon}</span>
                </div>
                <div className="sport-info">
                  <h3 className="sport-name">{sport.name}</h3>
                  <p className="sport-desc">{sport.description}</p>
                  <button
                    onClick={() => handleExploreSport(sport.name)}
                    className="btn-primary"
                    style={{ width: '100%', padding: '0.65rem' }}
                  >
                    Explore Grounds
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
