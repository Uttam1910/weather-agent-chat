import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('weather_favorites');
    return saved ? JSON.parse(saved) : ['London', 'New York', 'Tokyo', 'Paris'];
  });

  const [recents, setRecents] = useState(() => {
    const saved = localStorage.getItem('weather_recents');
    return saved ? JSON.parse(saved) : ['Mumbai', 'Sydney', 'Berlin'];
  });

  const [tempUnit, setTempUnit] = useState(() => {
    return localStorage.getItem('weather_temp_unit') || 'C';
  });

  const [speedUnit, setSpeedUnit] = useState(() => {
    return localStorage.getItem('weather_speed_unit') || 'kmh';
  });

  useEffect(() => {
    localStorage.setItem('weather_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('weather_recents', JSON.stringify(recents));
  }, [recents]);

  useEffect(() => {
    localStorage.setItem('weather_temp_unit', tempUnit);
  }, [tempUnit]);

  useEffect(() => {
    localStorage.setItem('weather_speed_unit', speedUnit);
  }, [speedUnit]);

  const toggleTempUnit = () => {
    setTempUnit(prev => (prev === 'C' ? 'F' : 'C'));
  };

  const toggleSpeedUnit = () => {
    setSpeedUnit(prev => (prev === 'kmh' ? 'mph' : 'kmh'));
  };

  const formatTemp = (celsius) => {
    if (celsius === null || celsius === undefined) return '--';
    if (tempUnit === 'F') {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(celsius)}°C`;
  };

  const getTempNum = (celsius) => {
    if (celsius === null || celsius === undefined) return 0;
    if (tempUnit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  const formatSpeed = (kmh) => {
    if (kmh === null || kmh === undefined) return '--';
    if (speedUnit === 'mph') {
      return `${Math.round(kmh * 0.621371)} mph`;
    }
    return `${Math.round(kmh)} km/h`;
  };

  const addFavorite = (city) => {
    if (!city) return;
    setFavorites(prev => {
      const normalized = city.trim();
      if (!prev.some(c => c.toLowerCase() === normalized.toLowerCase())) {
        return [normalized, ...prev];
      }
      return prev;
    });
  };

  const removeFavorite = (city) => {
    setFavorites(prev => prev.filter(c => c.toLowerCase() !== city.toLowerCase()));
  };

  const isFavorite = (city) => {
    if (!city) return false;
    return favorites.some(c => c.toLowerCase() === city.toLowerCase());
  };

  const addRecent = (city) => {
    if (!city) return;
    setRecents(prev => {
      const normalized = city.trim();
      const filtered = prev.filter(c => c.toLowerCase() !== normalized.toLowerCase());
      return [normalized, ...filtered].slice(0, 6);
    });
  };

  const clearRecents = () => {
    setRecents([]);
  };

  return (
    <UserContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        recents,
        addRecent,
        clearRecents,
        tempUnit,
        speedUnit,
        toggleTempUnit,
        toggleSpeedUnit,
        formatTemp,
        getTempNum,
        formatSpeed,
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
