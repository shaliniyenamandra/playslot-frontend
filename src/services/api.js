const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  getHealth: () => apiRequest('/api/health'),
  login: (username, password) => apiRequest('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),
  getSports: () => apiRequest('/api/sports'),
  getGrounds: () => apiRequest('/api/grounds'),
  getGroundById: (id) => apiRequest(`/api/grounds/${id}`),
  createBooking: (bookingData) => apiRequest('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  }),
  getUserBookings: (username) => apiRequest(`/api/bookings?username=${encodeURIComponent(username)}`),
  cancelBooking: (id) => apiRequest(`/api/bookings/${id}`, {
    method: 'DELETE'
  }),
};
