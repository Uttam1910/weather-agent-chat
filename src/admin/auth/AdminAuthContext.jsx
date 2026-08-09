import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

const ENV_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
const ENV_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'WeatherAgentAdmin2026!';

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('weather_admin_session') === 'active';
  });

  const [failedAttempts, setFailedAttempts] = useState(() => {
    return parseInt(localStorage.getItem('weather_admin_failed_attempts') || '0', 10);
  });

  const [lockoutUntil, setLockoutUntil] = useState(() => {
    return parseInt(localStorage.getItem('weather_admin_lockout_until') || '0', 10);
  });

  useEffect(() => {
    localStorage.setItem('weather_admin_failed_attempts', failedAttempts.toString());
  }, [failedAttempts]);

  useEffect(() => {
    localStorage.setItem('weather_admin_lockout_until', lockoutUntil.toString());
  }, [lockoutUntil]);

  const login = async (username, password) => {
    const now = Date.now();
    if (lockoutUntil && now < lockoutUntil) {
      const remainingSecs = Math.ceil((lockoutUntil - now) / 1000);
      throw new Error(`Too many failed attempts. Try again in ${remainingSecs} seconds.`);
    }

    // Server-style credential validation against environment configuration
    if (username === ENV_USERNAME && password === ENV_PASSWORD) {
      setFailedAttempts(0);
      setLockoutUntil(0);
      sessionStorage.setItem('weather_admin_session', 'active');
      setIsAuthenticated(true);
      return true;
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);

      if (nextAttempts >= 5) {
        const lockoutTime = now + 120000; // 2 minute lockout
        setLockoutUntil(lockoutTime);
        throw new Error('Too many failed attempts. Account locked for 2 minutes.');
      }

      throw new Error('Invalid credentials.');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('weather_admin_session');
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        failedAttempts,
        lockoutUntil,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
