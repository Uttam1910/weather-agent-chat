import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import SearchBar from '../components/SearchBar';
import SEO from '../components/SEO';
import { WiDaySunny } from 'react-icons/wi';
import { FaHistory, FaStar } from 'react-icons/fa';

export default function Home() {
  const navigate = useNavigate();
  const { recents, favorites, addRecent } = useUser();
  const [loading, setLoading] = useState(false);

  const handleSearch = (city) => {
    setLoading(true);
    addRecent(city);
    navigate(`/weather/${city}`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 flex flex-col items-center">
      <SEO 
        title="Weather Agent - World Class Weather Forecasts"
        description="Get accurate, real-time weather forecasts with a beautiful, magical interface."
      />

      <div className="w-full max-w-2xl flex flex-col gap-8">
        {/* Hero Section */}
        <div className="text-center py-10 animate-fadeIn">
          <div className="w-24 h-24 bg-gradient-to-tr from-blue-400 to-purple-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/40 animate-float">
            <WiDaySunny className="text-6xl text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Weather Agent</h1>
          <p className="text-white/60 text-lg max-w-md mx-auto">
            Experience weather forecasting with a touch of magic. Accurate, beautiful, and real-time.
          </p>
        </div>

        <SearchBar onSearch={handleSearch} isLoading={loading} />

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Recent Searches */}
          {recents.length > 0 && (
            <div className="bg-glass-100 p-6 rounded-3xl border border-white/10">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <FaHistory className="text-blue-400" /> Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recents.map((city, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(city)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-sm text-white/80 transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="bg-glass-100 p-6 rounded-3xl border border-white/10">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <FaStar className="text-yellow-400" /> Favorites
              </h3>
              <div className="flex flex-wrap gap-2">
                {favorites.map((city, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(city)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-sm text-white/80 transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
