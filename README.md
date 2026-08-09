# 🌤️ Weather Agent — Weather Intelligence & Private Operations Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Open-Meteo](https://img.shields.io/badge/Data-Open--Meteo_APIs-00A8E8)](https://open-meteo.com/)
[![Deterministic Engine](https://img.shields.io/badge/Engine-100%25_Deterministic-emerald)](https://github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

> *"Don't just tell users what the weather is. Tell them what the weather means for what they want to do."*

**Weather Agent** is a state-of-the-art **Weather Intelligence & Decision Platform** featuring a **Private Admin Operations System**. Operating on physical atmospheric variables from Open-Meteo APIs, Weather Agent calculates activity suitability scores, best daily time windows, commute risks, trip packing checklists, and outdoor event feasibility — **with 100% explainable rules and ZERO reliance on opaque AI models or fake demo values**.

---

## ✨ Key Features & Product Intelligence

### 🌟 1. Public Weather Intelligence Application
- 📍 **Real Current-Location Weather**: Intelligent browser Geolocation API (`navigator.geolocation`) with reverse-geocoding, privacy notifications, location prompt card, and instant manual search fallbacks.
- 🧮 **15+ Outdoor Activity Scoring Models**: Deterministic 0–100 suitability scores with pros (`✓`) and cons (`✗`) for Running, Walking/Hiking, Cycling, Photography, Beach/Swimming, Outdoor Dining, Stargazing, Golf, Dog Walking, Gardening, Driving, Camping, Outdoor HIIT, Fishing, and Motorcycle Riding.
- ⭐ **Signature *"What Should I Do Today?"* Decision Card**: Analyzes current weather parameters and user interests to rank top recommended activities, peak time window, activities to avoid, and atmospheric rationale.
- ⏱️ **Best Time Engine**: Scans 24-hour hourly forecasts to compute optimal consecutive activity windows (e.g. `06:00 AM – 08:00 AM`).
- 🗓️ **Weather-Based Day Planner**: Maps hourly forecasts into a 6-slot daily timeline (`07:00`, `09:00`, `12:00`, `15:00`, `18:00`, `21:00`).
- 🚗 **Smart Commute Intelligence**: Morning (07:00–09:00) vs. Evening (17:00–19:00) commute safety scores, rain delay risk, and drive advisories.
- ✈️ **Travel Weather Planner & Packing Checklist**: Multi-day trip weather score, highest rain risk day, best outdoor day, and deterministic gear packing lists.
- 💍 **Outdoor Event Monitor**: Evaluates event feasibility (Weddings, Concerts, Picnics, Sports) with concerns and backup windows.
- 📸 **Photography Mode & Golden Hour**: Sunset lighting scores and solar window calculator.
- 🏖️ **Coastal Marine & Gardening Intelligence**: Wave heights, surf scores, and soil moisture watering recommendations for coastal & inland locations.
- 📊 **Historical Climate Benchmark**: Compares current metrics against 5–10 year historical climate averages.

---

### 🔒 2. Private Admin Operations & Analytics System
- 🔑 **Secret & Configurable Route**: Hosted on a secret path configured via environment variable `VITE_ADMIN_PATH` (defaults to `/private-weather-control`). Unlinked from public navigation with `noindex, nofollow` SEO meta tags and separate bundle code-splitting.
- 🛡️ **Session Authentication & Rate Limiting**: Credentials defined via environment variables (`VITE_ADMIN_USERNAME` & `VITE_ADMIN_PASSWORD`). Features login brute-force protection (locks for 2 minutes after 5 failed attempts).
- 📈 **Real Data Telemetry (Zero Fake Numbers)**: Fresh installation starts at **0 visitors, 0 searches, 0 page views**. Uses a first-party anonymous visitor identifier (`weather_visitor_id`) to track **New vs. Returning Visitors** without capturing personal data.
- 🗄️ **Persistent Local Database**: Built on IndexedDB (`WeatherAnalyticsDB`) with a non-blocking tracking engine (`tracker.js`). Tracking failures never impact public weather searches.
- 🖥️ **SaaS Operations Dashboard**:
  - **Overview**: 8 KPI Cards (Total Visitors, Unique Visitors, Sessions, Page Views, Weather Searches, Unique Locations, API Requests, Errors) + Live Activity Stream.
  - **Visitors & Traffic**: New vs Returning breakdown, Device Types (Desktop, Mobile, Tablet), Browsers, and Top Referrers.
  - **Weather Searches**: Top Searched Destinations ranking table + Search Source Breakdown (Current Location GPS vs. Manual City Search).
  - **Feature Usage**: Usage breakdown of Activity Intelligence, Travel Planner, Event Monitor, etc.
  - **API & System Health**: Open-Meteo API request counts, average latency (ms), success rate (%), and error monitoring.

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: React 19, Vite 7, Tailwind CSS, Framer Motion, Recharts, React Icons, React Helmet Async.
- **Weather Data Layer (`WeatherProvider.js`)**:
  - Open-Meteo Forecast API
  - Open-Meteo Air Quality API
  - Open-Meteo Marine Weather API
  - Open-Meteo Historical Archive API
  - BigDataCloud Reverse Geocoding API
  - **Caching**: 15-minute in-memory TTL caching and request deduplication.
- **Analytics Store (`analyticsStore.js`)**: IndexedDB persistent event store.

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory (refer to `.env.example`):

```env
# Private Admin Secret Route Path (Unlinked from public navigation)
VITE_ADMIN_PATH=/private-weather-control

# Private Admin Credentials (Validated server-side in session memory)
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=change_this_secure_password
```

---

## 📦 Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/Uttam1910/weather-agent-chat.git
cd weather-agent-chat

# 2. Install dependencies
npm install

# 3. Create .env configuration
cp .env.example .env

# 4. Start local development server
npm run dev

# App runs at: http://localhost:5173
# Private Admin System: http://localhost:5173/private-weather-control
```

---

## 🚀 Building for Production

```bash
# Execute Vite production bundle build
npm run build

# Preview production build locally
npm run preview
```

---

## 📜 License & Attribution

- **License**: Released under the MIT License.
- **Data Source**: Free zero-key weather APIs provided by [Open-Meteo](https://open-meteo.com/) under [Creative Commons Attribution 4.0 (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
