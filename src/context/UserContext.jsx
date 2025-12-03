import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('weather_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [recents, setRecents] = useState(() => {
    const saved = localStorage.getItem('weather_recents');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('weather_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('weather_recents', JSON.stringify(recents));
  }, [recents]);

  const addFavorite = (city) => {
    if (!favorites.includes(city)) {
      setFavorites(prev => [...prev, city]);
    }
  };

  const removeFavorite = (city) => {
    setFavorites(prev => prev.filter(c => c !== city));
  };

  const addRecent = (city) => {
    setRecents(prev => {
      const filtered = prev.filter(c => c !== city);
      return [city, ...filtered].slice(0, 5); // Keep last 5
    });
  };

  const clearRecents = () => {
    setRecents([]);
  };

  return (
    <UserContext.Provider value={{ favorites, addFavorite, removeFavorite, recents, addRecent, clearRecents }}>
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
