import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchWeatherData, fetchReverseGeocoding } from '../weather-intelligence/providers/WeatherProvider';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('weather_favorites');
    return saved ? JSON.parse(saved) : ['New York', 'Tokyo', 'Paris'];
  });

  const [recents, setRecents] = useState(() => {
    const saved = localStorage.getItem('weather_recents');
    return saved ? JSON.parse(saved) : ['Mumbai', 'Sydney', 'Berlin'];
  });

  const [userInterests, setUserInterests] = useState(() => {
    const saved = localStorage.getItem('weather_user_interests');
    return saved ? JSON.parse(saved) : ['running', 'walking', 'photography', 'dining', 'cycling'];
  });

  const [savedLocations, setSavedLocations] = useState(() => {
    const saved = localStorage.getItem('weather_saved_locations');
    return saved ? JSON.parse(saved) : [
      { id: 'loc_work', label: 'Work', city: 'New York' },
      { id: 'loc_travel', label: 'Travel Destination', city: 'Paris' },
    ];
  });

  const [savedEvents, setSavedEvents] = useState(() => {
    const saved = localStorage.getItem('weather_saved_events');
    return saved ? JSON.parse(saved) : [
      { id: 'evt_1', name: 'Outdoor Weekend Picnic', city: 'Paris', type: 'picnic', date: '2026-08-15' },
    ];
  });

  const [tempUnit, setTempUnit] = useState(() => {
    return localStorage.getItem('weather_temp_unit') || 'C';
  });

  const [speedUnit, setSpeedUnit] = useState(() => {
    return localStorage.getItem('weather_speed_unit') || 'kmh';
  });

  const [entitlementTier, setEntitlementTier] = useState(() => {
    return localStorage.getItem('weather_entitlement_tier') || 'free';
  });

  // Location State Model
  const [locationState, setLocationState] = useState(() => {
    const pref = localStorage.getItem('weather_location_pref');
    const lastManual = localStorage.getItem('weather_last_manual_location');
    if (pref === 'current') {
      return { source: 'current', loading: true, isCurrentLocation: true };
    }
    if (lastManual) {
      return { source: 'manual', city: lastManual, loading: false, isCurrentLocation: false };
    }
    return { source: 'prompt', loading: false, isCurrentLocation: false };
  });

  const [currentWeather, setCurrentWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  // Load weather when locationState changes
  const loadWeatherForLocation = useCallback(async (locInput) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const data = await fetchWeatherData(locInput);
      setCurrentWeather(data);
      setWeatherLoading(false);
      return data;
    } catch (err) {
      setWeatherError(err.message || 'Weather data unavailable.');
      setWeatherLoading(false);
      return null;
    }
  }, []);

  // Detect GPS location with browser Geolocation API
  const detectCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationState({
        source: 'error',
        errorReason: 'Geolocation is not supported by your browser.',
        loading: false,
        isCurrentLocation: false,
      });
      return;
    }

    setLocationState((prev) => ({ ...prev, loading: true, source: 'current' }));
    setWeatherLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const locationName = await fetchReverseGeocoding(latitude, longitude);
          const data = await fetchWeatherData({ lat: latitude, lon: longitude, name: locationName });

          setCurrentWeather(data);
          setLocationState({
            source: 'current',
            city: data.location,
            country: data.country || '',
            lat: latitude,
            lon: longitude,
            isCurrentLocation: true,
            loading: false,
          });

          localStorage.setItem('weather_location_pref', 'current');
        } catch (err) {
          setLocationState({
            source: 'error',
            errorReason: "We couldn't load weather for your current coordinates.",
            loading: false,
            isCurrentLocation: false,
          });
        } finally {
          setWeatherLoading(false);
        }
      },
      (error) => {
        setWeatherLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationState({
            source: 'denied',
            errorReason: 'Location access is off. Search for a city to see local weather.',
            loading: false,
            isCurrentLocation: false,
          });
        } else {
          setLocationState({
            source: 'error',
            errorReason: "We couldn't determine your location. Search manually.",
            loading: false,
            isCurrentLocation: false,
          });
        }
      },
      { timeout: 10000, enableHighAccuracy: false, maximumAge: 300000 }
    );
  }, []);

  // Set Manual Location Search
  const setManualLocation = useCallback(async (cityOrCoords) => {
    setWeatherLoading(true);
    try {
      const data = await fetchWeatherData(cityOrCoords);
      setCurrentWeather(data);
      setLocationState({
        source: 'manual',
        city: data.location,
        country: data.country || '',
        lat: data.coord?.lat || null,
        lon: data.coord?.lon || null,
        isCurrentLocation: false,
        loading: false,
      });

      if (typeof cityOrCoords === 'string') {
        localStorage.setItem('weather_last_manual_location', cityOrCoords);
      } else if (cityOrCoords.name) {
        localStorage.setItem('weather_last_manual_location', cityOrCoords.name);
      }
      localStorage.setItem('weather_location_pref', 'manual');
      return data;
    } catch (err) {
      setWeatherError(err.message);
      throw err;
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  // Initial load effect
  useEffect(() => {
    const pref = localStorage.getItem('weather_location_pref');
    const lastManual = localStorage.getItem('weather_last_manual_location');

    if (pref === 'current') {
      detectCurrentLocation();
    } else if (lastManual) {
      setManualLocation(lastManual).catch(() => {});
    }
  }, [detectCurrentLocation, setManualLocation]);

  useEffect(() => {
    localStorage.setItem('weather_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('weather_recents', JSON.stringify(recents));
  }, [recents]);

  useEffect(() => {
    localStorage.setItem('weather_user_interests', JSON.stringify(userInterests));
  }, [userInterests]);

  useEffect(() => {
    localStorage.setItem('weather_saved_locations', JSON.stringify(savedLocations));
  }, [savedLocations]);

  useEffect(() => {
    localStorage.setItem('weather_saved_events', JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    localStorage.setItem('weather_temp_unit', tempUnit);
  }, [tempUnit]);

  useEffect(() => {
    localStorage.setItem('weather_speed_unit', speedUnit);
  }, [speedUnit]);

  useEffect(() => {
    localStorage.setItem('weather_entitlement_tier', entitlementTier);
  }, [entitlementTier]);

  const toggleTempUnit = () => setTempUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  const toggleSpeedUnit = () => setSpeedUnit((prev) => (prev === 'kmh' ? 'mph' : 'kmh'));

  const formatTemp = (celsius) => {
    if (celsius === null || celsius === undefined) return '--';
    if (tempUnit === 'F') return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    return `${Math.round(celsius)}°C`;
  };

  const getTempNum = (celsius) => {
    if (celsius === null || celsius === undefined) return 0;
    if (tempUnit === 'F') return Math.round((celsius * 9) / 5 + 32);
    return Math.round(celsius);
  };

  const formatSpeed = (kmh) => {
    if (kmh === null || kmh === undefined) return '--';
    if (speedUnit === 'mph') return `${Math.round(kmh * 0.621371)} mph`;
    return `${Math.round(kmh)} km/h`;
  };

  const toggleInterest = (interestId) => {
    setUserInterests((prev) => {
      if (prev.includes(interestId)) {
        return prev.filter((i) => i !== interestId);
      }
      return [...prev, interestId];
    });
  };

  const addSavedLocation = (label, city) => {
    setSavedLocations((prev) => [...prev, { id: `loc_${Date.now()}`, label, city }]);
  };

  const removeSavedLocation = (id) => {
    setSavedLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

  const addSavedEvent = (name, city, type, date) => {
    setSavedEvents((prev) => [...prev, { id: `evt_${Date.now()}`, name, city, type, date }]);
  };

  const removeSavedEvent = (id) => {
    setSavedEvents((prev) => prev.filter((evt) => evt.id !== id));
  };

  const addFavorite = (city) => {
    if (!city) return;
    setFavorites((prev) => {
      const normalized = city.trim();
      if (!prev.some((c) => c.toLowerCase() === normalized.toLowerCase())) {
        return [normalized, ...prev];
      }
      return prev;
    });
  };

  const removeFavorite = (city) => {
    setFavorites((prev) => prev.filter((c) => c.toLowerCase() !== city.toLowerCase()));
  };

  const isFavorite = (city) => {
    if (!city) return false;
    return favorites.some((c) => c.toLowerCase() === city.toLowerCase());
  };

  const addRecent = (city) => {
    if (!city) return;
    setRecents((prev) => {
      const normalized = city.trim();
      const filtered = prev.filter((c) => c.toLowerCase() !== normalized.toLowerCase());
      return [normalized, ...filtered].slice(0, 6);
    });
  };

  return (
    <UserContext.Provider
      value={{
        locationState,
        detectCurrentLocation,
        setManualLocation,
        loadWeatherForLocation,
        currentWeather,
        weatherLoading,
        weatherError,
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        recents,
        addRecent,
        userInterests,
        toggleInterest,
        savedLocations,
        addSavedLocation,
        removeSavedLocation,
        savedEvents,
        addSavedEvent,
        removeSavedEvent,
        tempUnit,
        speedUnit,
        toggleTempUnit,
        toggleSpeedUnit,
        formatTemp,
        getTempNum,
        formatSpeed,
        entitlementTier,
        setEntitlementTier,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
