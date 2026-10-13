import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function ExploreGrounds() {
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedSport = searchParams.get('sport') || 'ALL';

  useEffect(() => {
    async function fetchGrounds() {
      try {
        setLoading(true);
        const data = await api.getGrounds();
        setGrounds(data || []);
      } catch (err) {
        setError('Failed to load grounds from Java backend: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGrounds();
  }, []);

  const sportsFilterList = ['ALL', 'Cricket', 'Football', 'Badminton', 'Basketball'];

  const filteredGrounds = selectedSport === 'ALL'
    ? grounds
    : grounds.filter(g => g.sport.toLowerCase() === selectedSport.toLowerCase());

  const handleFilterClick = (sport) => {
    if (sport === 'ALL') {
      searchParams.delete('sport');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ sport });
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">Explore Sports Grounds</h1>
          <p className="section-desc">Find top-rated courts and turfs in the Hyderabad area</p>
        </div>
      </div>

      <div className="filter-bar">
        {sportsFilterList.map((sport) => (
          <button
            key={sport}
            onClick={() => handleFilterClick(sport)}
            className={`filter-chip ${selectedSport.toLowerCase() === sport.toLowerCase() ? 'active' : ''}`}
          >
            {sport === 'ALL' ? '🌟 All Sports' : sport}
          </button>
        ))}
      </div>

      {error && (
        <div className="alert-box alert-danger">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          Loading grounds from Java Spring Boot API...
        </div>
      ) : filteredGrounds.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          No grounds found for the selected category.
        </div>
      ) : (
        <div className="grounds-grid">
          {filteredGrounds.map((ground) => (
            <div key={ground.id} className="ground-card">
              <div className="ground-img-wrapper">
                <img src={ground.imageUrl} alt={ground.name} className="ground-img" />
                <span className="ground-sport-tag">{ground.sport}</span>
              </div>
              <div className="ground-info">
                <h3 className="ground-name">{ground.name}</h3>
                <div className="ground-location">
                  📍 {ground.location}
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.2rem', lineHeight: '1.4' }}>
                  {ground.description}
                </p>
                <div className="ground-footer">
                  <div className="ground-price">
                    ₹{ground.hourlyPrice.toLocaleString()} <span>/ hour</span>
                  </div>
                  <button
                    onClick={() => navigate(`/book/${ground.id}`)}
                    className="btn-primary"
                    style={{ padding: '0.55rem 1rem', fontSize: '0.9rem' }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
