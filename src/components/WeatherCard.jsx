import { FiWind, FiDroplet, FiSun, FiMoon } from 'react-icons/fi';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog, WiDayHaze, WiBarometer } from 'react-icons/wi';

export default function WeatherCard({ weatherData }) {
  if (!weatherData) return null;

  const { location, description, temperature, feelsLike, humidity, windSpeed, pressure, sunrise, sunset, icon } = weatherData;
  const isDay = new Date().getHours() >= 6 && new Date().getHours() < 20;

  const getWeatherIcon = (iconCode, size = "large") => {
    const className = size === "large" 
      ? "text-7xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] animate-float" 
      : "text-3xl text-white drop-shadow-md";
    
    if (!iconCode) return <WiDaySunny className={className} />;
    if (iconCode.includes('01')) return <WiDaySunny className={className} />;
    if (iconCode.includes('02')) return <WiDayHaze className={className} />;
    if (iconCode.includes('03') || iconCode.includes('04')) return <WiCloudy className={className} />;
    if (iconCode.includes('09') || iconCode.includes('10')) return <WiRain className={className} />;
    if (iconCode.includes('11')) return <WiThunderstorm className={className} />;
    if (iconCode.includes('13')) return <WiSnow className={className} />;
    if (iconCode.includes('50')) return <WiFog className={className} />;
    return <WiDaySunny className={className} />;
  };

  return (
    <div className="w-full animate-fadeIn">
      {/* Main Weather Card */}
      <div className="bg-glass-200 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20 shadow-2xl mb-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">{location}</h2>
            <p className="text-lg text-white/80 capitalize font-medium flex items-center gap-2">
              {description}
              <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs border border-white/10">
                {isDay ? 'Day' : 'Night'}
              </span>
            </p>
          </div>
          <div className="text-right">
             {getWeatherIcon(icon, "large")}
          </div>
        </div>

        <div className="mt-6 flex items-baseline gap-2">
           <span className="text-6xl font-bold text-white tracking-tighter">{Math.round(temperature)}°</span>
           <span className="text-xl text-white/60 font-medium">Feels like {Math.round(feelsLike)}°</span>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
         <div className="bg-glass-100 p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-1 hover:bg-glass-200 transition-colors">
            <FiWind className="text-2xl text-blue-300 mb-1" />
            <span className="text-xs text-white/60 uppercase tracking-wider">Wind</span>
            <span className="text-lg font-bold text-white">{windSpeed} <span className="text-xs font-normal">km/h</span></span>
         </div>
         <div className="bg-glass-100 p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-1 hover:bg-glass-200 transition-colors">
            <FiDroplet className="text-2xl text-blue-400 mb-1" />
            <span className="text-xs text-white/60 uppercase tracking-wider">Humidity</span>
            <span className="text-lg font-bold text-white">{humidity}%</span>
         </div>
         <div className="bg-glass-100 p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-1 hover:bg-glass-200 transition-colors">
            <WiBarometer className="text-3xl text-green-300 mb-1" />
            <span className="text-xs text-white/60 uppercase tracking-wider">Pressure</span>
            <span className="text-lg font-bold text-white">{pressure}</span>
         </div>
         <div className="bg-glass-100 p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-1 hover:bg-glass-200 transition-colors">
            {isDay ? <FiSun className="text-2xl text-yellow-300 mb-1" /> : <FiMoon className="text-2xl text-purple-300 mb-1" />}
            <span className="text-xs text-white/60 uppercase tracking-wider">{isDay ? 'Sunrise' : 'Sunset'}</span>
            <span className="text-lg font-bold text-white">
              {isDay ? sunrise?.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : sunset?.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
            </span>
         </div>
      </div>
    </div>
  );
}
