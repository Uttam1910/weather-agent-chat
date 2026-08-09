import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const AUTO_WEATHER_CYCLE = ['clear', 'rain', 'snow', 'thunderstorm', 'clouds'];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'weather-auto';
  });

  const [weatherCondition, setWeatherCondition] = useState('clear');
  const [isAutoCycling, setIsAutoCycling] = useState(true);

  // Auto-rotation timer for weather-auto mode when auto-cycling is enabled
  useEffect(() => {
    let timer;
    if (theme === 'weather-auto' && isAutoCycling) {
      timer = setInterval(() => {
        setWeatherCondition((prev) => {
          const currentIndex = AUTO_WEATHER_CYCLE.indexOf(prev);
          const nextIndex = (currentIndex + 1) % AUTO_WEATHER_CYCLE.length;
          return AUTO_WEATHER_CYCLE[nextIndex];
        });
      }, 5000); // Cycles every 5 seconds
    }
    return () => clearInterval(timer);
  }, [theme, isAutoCycling]);

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    if (newTheme === 'weather-auto') {
      setIsAutoCycling(true);
    } else {
      setIsAutoCycling(false);
    }
  };

  const updateWeatherCondition = (condition, lockToCity = true) => {
    if (!condition) return;

    if (lockToCity) {
      setIsAutoCycling(false); // Stop cycling so city weather stays locked
    }

    const condLower = condition.toLowerCase();
    if (condLower.includes('rain') || condLower.includes('drizzle')) {
      setWeatherCondition('rain');
    } else if (condLower.includes('snow') || condLower.includes('ice') || condLower.includes('flurry')) {
      setWeatherCondition('snow');
    } else if (condLower.includes('thunder') || condLower.includes('storm')) {
      setWeatherCondition('thunderstorm');
    } else if (condLower.includes('cloud') || condLower.includes('fog') || condLower.includes('overcast')) {
      setWeatherCondition('clouds');
    } else {
      setWeatherCondition('clear');
    }
  };

  const resumeAutoCycle = () => {
    setTheme('weather-auto');
    setIsAutoCycling(true);
  };

  const toggleAutoCycle = () => {
    setIsAutoCycling((prev) => !prev);
  };

  // Get active color theme gradient class
  const getThemeGradient = () => {
    if (theme === 'sunburst') {
      return 'from-amber-950 via-orange-900 to-rose-950';
    }
    if (theme === 'aurora') {
      return 'from-emerald-950 via-teal-900 to-indigo-950';
    }
    if (theme === 'cosmic') {
      return 'from-slate-950 via-purple-950 to-indigo-950';
    }
    if (theme === 'ice') {
      return 'from-cyan-950 via-blue-900 to-sky-950';
    }
    if (theme === 'dark') {
      return 'from-gray-950 via-slate-900 to-zinc-950';
    }
    // Default weather-auto
    switch (weatherCondition) {
      case 'rain':
        return 'from-slate-950 via-blue-950 to-cyan-950';
      case 'snow':
        return 'from-sky-950 via-slate-900 to-indigo-950';
      case 'thunderstorm':
        return 'from-purple-950 via-slate-950 to-indigo-950';
      case 'clouds':
        return 'from-gray-950 via-slate-900 to-blue-950';
      case 'clear':
      default:
        return 'from-blue-950 via-indigo-950 to-purple-950';
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        changeTheme,
        weatherCondition,
        updateWeatherCondition,
        getThemeGradient,
        isAutoCycling,
        resumeAutoCycle,
        toggleAutoCycle,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
