# PlaySlot — Frontend (React + Vite)

Sports Ground Booking Management System frontend built using React.js, Vite, and React Router.

## Project Overview
PlaySlot is a college project demonstration allowing sports enthusiasts to explore and book venues across Cricket, Football, Badminton, and Basketball in Hyderabad.

## Features
- **Demo Login**: Seamless authentication with any non-empty username/password. Pre-configured with `admin` / `admin123`.
- **Sports Category Dashboard**: Dynamic categories served by Spring Boot.
- **Explore Venues**: Filterable cards with hourly pricing and locations.
- **Interactive Booking**: Date and time slot selection with immediate validation.
- **My Bookings & Cancellation**: Real-time status update with immediate slot release.

## Environment Variables
- `VITE_API_BASE_URL`: Base URL of the deployed Spring Boot backend (defaults to `http://localhost:8080`).

## Deployment
Configured for automated zero-config deployment on Vercel with single-page app rewrite support via `vercel.json`.
