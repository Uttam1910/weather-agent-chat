import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';
import { fetchCitySuggestions, fetchReverseGeocoding } from '../utils/weatherApi';

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch live autocomplete suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        const results = await fetchCitySuggestions(query);
        setSuggestions(results);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (cityItem) => {
    setQuery(cityItem.displayLabel);
    setShowDropdown(false);
    onSearch(cityItem.displayLabel);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationName = await fetchReverseGeocoding(latitude, longitude);
        setGeoLoading(false);
        onSearch({ lat: latitude, lon: longitude, name: locationName });
      },
      (error) => {
        setGeoLoading(false);
        console.warn('Geolocation error:', error);
        alert('Could not retrieve your location. Please type your city in the search bar.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="w-full relative max-w-xl mx-auto" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
            placeholder="Search city, e.g., London, Tokyo, Paris..."
            className="w-full py-4 pl-12 pr-28 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white placeholder-white/50 text-base focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:bg-white/15 transition-all shadow-lg"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-lg pointer-events-none" />

          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSuggestions([]); }}
              className="absolute right-24 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
            >
              <FaTimes />
            </button>
          )}

          {/* GPS Button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={geoLoading}
            title="Use current location"
            className="absolute right-12 top-1/2 -translate-y-1/2 p-2.5 rounded-full text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {geoLoading ? (
              <ImSpinner8 className="animate-spin text-base" />
            ) : (
              <FaMapMarkerAlt className="text-lg hover:scale-110 transition-transform" />
            )}
          </button>

          {/* Submit Search Button */}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-md"
          >
            {isLoading ? <ImSpinner8 className="animate-spin text-base" /> : <FaSearch className="text-sm" />}
          </button>
        </div>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl z-50 animate-fadeIn">
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSuggestion(item)}
              className="w-full text-left px-5 py-3 text-white/90 hover:bg-purple-600/30 hover:text-white flex items-center justify-between border-b border-white/5 last:border-none transition-colors"
            >
              <span className="font-medium text-sm">{item.name}</span>
              <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded-full">
                {item.country || item.admin1}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
