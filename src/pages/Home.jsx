import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import SearchBar from '../components/SearchBar';
import SEO from '../components/SEO';
import WeatherCard from '../components/WeatherCard';
import LocationPromptCard from '../components/LocationPromptCard';
import WhatShouldIDoToday from '../components/WhatShouldIDoToday';
import ActivityScoreGrid from '../components/ActivityScoreGrid';
import SmartCommuteCard from '../components/SmartCommuteCard';
import DayPlannerTimeline from '../components/DayPlannerTimeline';
import HistoricalCompareCard from '../components/HistoricalCompareCard';
import TravelPlannerModal from '../components/TravelPlannerModal';
import EventMonitorModal from '../components/EventMonitorModal';

import { calculateComfortIndex } from '../weather-intelligence/scoring/comfortIndex';
import { calculateWeatherRisk } from '../weather-intelligence/scoring/riskIndex';

import { WiDaySunny } from 'react-icons/wi';
import { FaPlane, FaCalendarPlus, FaStar, FaHistory, FaShieldAlt, FaSmile, FaMapMarkerAlt } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

export default function Home() {
  const navigate = useNavigate();
  const {
    locationState,
    detectCurrentLocation,
    setManualLocation,
    currentWeather,
    weatherLoading,
    recents,
    favorites,
    savedLocations,
  } = useUser();

  const [showTravelModal, setShowTravelModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  const handleSearch = async (cityOrLocation) => {
    try {
      await setManualLocation(cityOrLocation);
    } catch (err) {
      console.warn('Search error:', err);
    }
  };

  const weather = currentWeather;
  const comfort = weather ? calculateComfortIndex(weather) : null;
  const risk = weather ? calculateWeatherRisk(weather) : null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex flex-col items-center">
      <SEO
        title="Weather Agent - Weather Intelligence Platform"
        description="Don't just check the weather. Discover what the weather means for running, travel, commuting, outdoor events, and daily planning."
      />

      <div className="w-full max-w-6xl space-y-10">
        {/* Hero Header */}
        <div className="text-center space-y-4 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-semibold text-purple-300 backdrop-blur-md shadow-lg">
            <WiDaySunny className="text-lg text-amber-400" />
            <span>Weather Intelligence & Decision Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Know what the weather means for <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
              what you want to do today.
            </span>
          </h1>

          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Deterministic activity scores, optimal time windows, smart commute advice, trip & event planners driven by physical weather metrics.
          </p>

          {/* Search Bar & Location Controls */}
          <div className="pt-2 max-w-xl mx-auto space-y-3">
            <SearchBar onSearch={handleSearch} isLoading={weatherLoading} />

            {/* Quick Location Action Pill */}
            <div className="flex justify-center items-center gap-2 text-xs">
              <button
                onClick={detectCurrentLocation}
                className="text-purple-300 hover:text-white flex items-center gap-1 font-semibold hover:underline bg-white/5 border border-white/10 px-3 py-1 rounded-full transition-all"
              >
                <FaMapMarkerAlt className="text-rose-400 text-xs" />
                <span>Use My Location</span>
              </button>
            </div>
          </div>

          {/* Action Modals Trigger Buttons */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => setShowTravelModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 rounded-2xl text-xs font-bold text-white shadow-lg flex items-center gap-2 transition-all hover:scale-105"
            >
              <FaPlane /> Travel Weather Planner
            </button>

            <button
              onClick={() => setShowEventModal(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl text-xs font-bold text-white shadow-md flex items-center gap-2 transition-all hover:scale-105"
            >
              <FaCalendarPlus className="text-purple-300" /> Outdoor Event Monitor
            </button>
          </div>
        </div>

        {/* First Load Experience: Location Prompt / Denied / Error Card */}
        {(!weather || locationState.source === 'prompt' || locationState.source === 'denied' || locationState.source === 'error') && (
          <LocationPromptCard />
        )}

        {/* Loading Skeleton */}
        {weatherLoading && (
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-12 text-center text-white/70 space-y-3 max-w-lg mx-auto">
            <ImSpinner8 className="animate-spin text-4xl text-purple-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Loading local weather intelligence...</h3>
            <p className="text-xs text-white/50">Processing atmospheric metrics and activity algorithms</p>
          </div>
        )}

        {/* Core Weather & Indices Snapshot Bar */}
        {weather && !weatherLoading && comfort && risk && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WeatherCard weatherData={weather} onClick={() => navigate(`/weather/${encodeURIComponent(weather.location)}`)} />

            {/* Comfort Index Card */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-xl flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-300">
                  <FaSmile className="text-xl" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Weather Comfort Index</h3>
                  <span className="text-xs text-white/60">{comfort.rating} Atmospheric Feel</span>
                </div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-white tracking-tight">{comfort.score} <span className="text-xs text-white/50">/ 100</span></div>
                <p className="text-xs text-white/70 mt-2 line-clamp-2">{comfort.reasons[0] || 'Ideal atmospheric balance'}</p>
              </div>
            </div>

            {/* Weather Risk Index Card */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-xl flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-300">
                  <FaShieldAlt className="text-xl" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Weather Risk Index</h3>
                  <span className={`text-xs font-bold ${risk.color}`}>{risk.level}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-white/80 leading-relaxed font-medium">{risk.factors[0]}</p>
                <span className="text-[10px] text-white/40 block mt-2">General planning indicator (non-emergency)</span>
              </div>
            </div>
          </div>
        )}

        {/* Signature Feature: What Should I Do Today? */}
        {weather && !weatherLoading && <WhatShouldIDoToday weather={weather} onSelectActivity={() => navigate(`/weather/${encodeURIComponent(weather.location)}`)} />}

        {/* 15 Activity Score Grid */}
        {weather && !weatherLoading && <ActivityScoreGrid weather={weather} />}

        {/* Smart Commute Intelligence */}
        {weather && !weatherLoading && <SmartCommuteCard hourly={weather.hourly} />}

        {/* Hourly Day Planner Timeline */}
        {weather && !weatherLoading && <DayPlannerTimeline hourly={weather.hourly} />}

        {/* Historical Climate Benchmark */}
        {weather && !weatherLoading && <HistoricalCompareCard weather={weather} />}

        {/* Quick Chips Grid: Saved Locations & Favorites */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedLocations.length > 0 && (
            <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-3xl border border-white/20 shadow-xl space-y-3">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <FaStar className="text-yellow-400" /> Saved Locations Intelligence
              </h3>
              <div className="flex flex-wrap gap-2">
                {savedLocations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => handleSearch(loc.city)}
                    className="px-4 py-2 bg-white/10 hover:bg-purple-600/40 border border-white/15 rounded-2xl text-xs font-semibold text-white transition-all hover:scale-105 shadow-sm flex items-center gap-2"
                  >
                    <span className="text-purple-300 font-bold">{loc.label}:</span>
                    <span>{loc.city}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {recents.length > 0 && (
            <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-3xl border border-white/20 shadow-xl space-y-3">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <FaHistory className="text-blue-400" /> Recent Location Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recents.map((city, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(city)}
                    className="px-4 py-2 bg-white/10 hover:bg-blue-600/40 border border-white/15 rounded-2xl text-xs font-semibold text-white/90 hover:text-white transition-all hover:scale-105 shadow-sm"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TravelPlannerModal isOpen={showTravelModal} onClose={() => setShowTravelModal(false)} />
      <EventMonitorModal isOpen={showEventModal} onClose={() => setShowEventModal(false)} />
    </div>
  );
}
