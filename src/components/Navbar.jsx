import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WiDaySunny } from 'react-icons/wi';
import { FaBars, FaTimes, FaPalette, FaThermometerHalf, FaSyncAlt, FaMapMarkerAlt, FaSearch, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const { theme, changeTheme, isAutoCycling, resumeAutoCycle } = useTheme();
  const {
    locationState,
    detectCurrentLocation,
    setManualLocation,
    tempUnit,
    toggleTempUnit,
    savedLocations,
    currentWeather,
  } = useUser();

  const themeMenuRef = useRef(null);
  const locMenuRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const themes = [
    { id: 'weather-auto', label: '⚡ Auto Cycle Themes' },
    { id: 'sunburst', label: '☀️ Sunburst Amber' },
    { id: 'aurora', label: '🌿 Aurora Storm' },
    { id: 'cosmic', label: '🌌 Cosmic Galaxy' },
    { id: 'ice', label: '❄️ Crystal Ice' },
    { id: 'dark', label: '🌙 Dark Glass' },
  ];

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/compare', label: 'Compare' },
    { path: '/blog', label: 'Blog' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/faq', label: 'FAQ' },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) {
        setShowThemeMenu(false);
      }
      if (locMenuRef.current && !locMenuRef.current.contains(e.target)) {
        setShowLocationMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayLocationLabel = currentWeather?.location || locationState.city || 'Select Location';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/60 backdrop-blur-2xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setIsOpen(false)}>
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-500 via-purple-500 to-amber-400 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <WiDaySunny className="text-white text-2xl" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Weather Agent</span>
          </Link>

          {/* Location Badge Selector Control */}
          <div className="relative" ref={locMenuRef}>
            <button
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full text-xs font-bold text-white transition-all shadow-sm max-w-[200px] sm:max-w-xs truncate"
            >
              <FaMapMarkerAlt className="text-rose-400 text-xs flex-shrink-0" />
              <span className="truncate">{displayLocationLabel}</span>
              {locationState.isCurrentLocation && (
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded-md font-semibold hidden sm:inline">
                  Current
                </span>
              )}
            </button>

            {/* Location Selector Menu */}
            {showLocationMenu && (
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-64 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-2 shadow-2xl z-50 animate-fadeIn space-y-2">
                <div className="text-[11px] font-semibold text-white/40 px-3 py-1 uppercase tracking-wider">
                  Location Control
                </div>

                {/* Use Current Location Action */}
                <button
                  onClick={() => {
                    detectCurrentLocation();
                    setShowLocationMenu(false);
                  }}
                  className="w-full text-left px-3 py-2.5 text-xs font-semibold rounded-xl bg-purple-600/30 hover:bg-purple-600 text-white transition-all flex items-center gap-2 border border-purple-400/30"
                >
                  <FaMapMarkerAlt className="text-rose-400" />
                  <span>Use My Current Location</span>
                </button>

                {/* Saved Locations List */}
                {savedLocations.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-white/10">
                    <div className="text-[10px] font-semibold text-white/40 px-3 py-0.5 uppercase">
                      Saved Places
                    </div>
                    {savedLocations.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => {
                          setManualLocation(loc.city);
                          setShowLocationMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white rounded-xl transition-all flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1.5">
                          <FaStar className="text-amber-400 text-[10px]" />
                          <span>{loc.label}</span>
                        </span>
                        <span className="text-[11px] text-white/50">{loc.city}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-white bg-white/10 px-3 py-1.5 rounded-full border border-white/15'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action Buttons: Unit Switcher & Theme Selector */}
          <div className="flex items-center gap-3">
            {/* Unit Switcher */}
            <button
              onClick={toggleTempUnit}
              title={`Switch unit to °${tempUnit === 'C' ? 'F' : 'C'}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full text-xs font-bold text-white transition-all shadow-sm"
            >
              <FaThermometerHalf className="text-amber-400 text-sm" />
              <span>°{tempUnit}</span>
            </button>

            {/* Theme Selector Dropdown */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                title="Change Theme"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full text-xs font-bold text-white transition-all shadow-sm"
              >
                <FaPalette className="text-purple-300 text-xs" />
                <span className="hidden sm:inline capitalize">
                  {theme === 'weather-auto' && isAutoCycling ? '⚡ Auto' : theme.replace('-auto', '')}
                </span>
                {theme === 'weather-auto' && isAutoCycling && (
                  <FaSyncAlt className="text-[10px] text-amber-300 animate-spin" />
                )}
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-2 shadow-2xl z-50 animate-fadeIn space-y-1">
                  <div className="text-[11px] font-semibold text-white/40 px-3 py-1 uppercase tracking-wider">
                    Select Theme Preset
                  </div>
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        if (t.id === 'weather-auto') {
                          resumeAutoCycle();
                        } else {
                          changeTheme(t.id);
                        }
                        setShowThemeMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-between ${
                        theme === t.id
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{t.label}</span>
                      {t.id === 'weather-auto' && isAutoCycling && (
                        <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-md">Live</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Navigation Toggle Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white p-2 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-2xl text-base font-semibold transition-colors ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
