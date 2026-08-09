import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import SearchBar from './SearchBar';
import { FaMapMarkerAlt, FaSearch, FaLock, FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

export default function LocationPromptCard() {
  const { locationState, detectCurrentLocation, setManualLocation } = useUser();
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleSearch = (city) => {
    setManualLocation(city);
  };

  if (locationState.loading) {
    return (
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl text-center space-y-4 max-w-lg mx-auto">
        <ImSpinner8 className="animate-spin text-4xl text-purple-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Finding your location...</h3>
        <p className="text-xs text-white/60">Fetching local atmospheric coordinates & weather data</p>
      </div>
    );
  }

  if (locationState.source === 'denied') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4 max-w-lg mx-auto text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto text-xl">
          <FaExclamationTriangle />
        </div>
        <h3 className="text-xl font-bold text-white">Location access is off</h3>
        <p className="text-xs text-white/70">{locationState.errorReason}</p>

        <div className="pt-2">
          <SearchBar onSearch={handleSearch} isLoading={false} />
        </div>
      </motion.div>
    );
  }

  if (locationState.source === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4 max-w-lg mx-auto text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center mx-auto text-xl">
          <FaExclamationTriangle />
        </div>
        <h3 className="text-xl font-bold text-white">We couldn't determine your location</h3>
        <p className="text-xs text-white/70">{locationState.errorReason}</p>

        <div className="pt-2">
          <SearchBar onSearch={handleSearch} isLoading={false} />
        </div>
      </motion.div>
    );
  }

  if (locationState.source === 'prompt') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900/90 via-purple-950/40 to-slate-900/90 backdrop-blur-2xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl text-center space-y-6 max-w-lg mx-auto relative overflow-hidden"
      >
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-500 to-blue-500 text-white flex items-center justify-center mx-auto text-2xl shadow-lg shadow-purple-500/30 animate-pulse">
          <FaMapMarkerAlt />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">Get weather for your location</h3>
          <p className="text-xs text-white/70 leading-relaxed">
            Allow location access to see local weather, forecasts, activity conditions, and advisories instantly.
          </p>
        </div>

        {!showSearchInput ? (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={detectCurrentLocation}
              className="px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 rounded-2xl text-sm font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <FaMapMarkerAlt /> Use My Location
            </button>

            <button
              onClick={() => setShowSearchInput(true)}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <FaSearch /> Search Manually
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <SearchBar onSearch={handleSearch} isLoading={false} />
            <button
              onClick={() => setShowSearchInput(false)}
              className="text-xs text-white/50 hover:text-white underline"
            >
              Back to options
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/40 pt-2 border-t border-white/5">
          <FaShieldAlt className="text-emerald-400" />
          <span>Your location is used to show local weather. No account needed.</span>
        </div>
      </motion.div>
    );
  }

  return null;
}
