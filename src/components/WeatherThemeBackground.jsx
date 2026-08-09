import { useTheme } from '../context/ThemeContext';

export default function WeatherThemeBackground() {
  const { theme, weatherCondition, getThemeGradient } = useTheme();

  const activeCondition = theme === 'weather-auto' ? weatherCondition : theme;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-1000">
      {/* Dynamic Main Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getThemeGradient()} transition-all duration-1000`} />

      {/* Weather Ambient Animations */}
      {/* 1. Clear / Sunburst - Floating Sun Ray Orbs */}
      {(activeCondition === 'clear' || activeCondition === 'sunburst') && (
        <>
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] animate-float-slow" />
        </>
      )}

      {/* 2. Rain / Drizzle Particle Animation */}
      {activeCondition === 'rain' && (
        <div className="absolute inset-0 opacity-40">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-cyan-200/60 rounded-full animate-rain"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                width: '1.5px',
                height: `${15 + Math.random() * 25}px`,
                animationDuration: `${0.8 + Math.random() * 0.8}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 3. Snow Particle Flakes */}
      {activeCondition === 'snow' && (
        <div className="absolute inset-0 opacity-60">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-snow shadow-sm shadow-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                width: `${4 + Math.random() * 6}px`,
                height: `${4 + Math.random() * 6}px`,
                animationDuration: `${3 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 4. Clouds & Fog Atmosphere */}
      {activeCondition === 'clouds' && (
        <>
          <div className="absolute top-1/4 left-[-10%] w-[600px] h-[300px] bg-slate-400/10 rounded-full blur-[90px] animate-float-slow" />
          <div className="absolute bottom-1/3 right-[-10%] w-[500px] h-[300px] bg-blue-300/10 rounded-full blur-[100px] animate-float-delayed" />
        </>
      )}

      {/* 5. Thunderstorm Ambient Glow */}
      {activeCondition === 'thunderstorm' && (
        <>
          <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-slow" />
        </>
      )}

      {/* 6. Cosmic Galaxy Theme */}
      {activeCondition === 'cosmic' && (
        <>
          <div className="absolute top-[-5%] left-[20%] w-[450px] h-[450px] bg-fuchsia-600/20 rounded-full blur-[110px] animate-pulse-slow" />
          <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[130px] animate-float" />
        </>
      )}

      {/* Global Noise / Glass Grain overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/10 to-black/30" />
    </div>
  );
}
