import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog, WiDayHaze } from 'react-icons/wi';

export default function ForecastRow({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  const getWeatherIcon = (iconCode) => {
    const className = "text-3xl text-white drop-shadow-md";
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
    <div className="bg-glass-100 rounded-2xl p-4 border border-white/10 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 animate-slideIn">
      <h3 className="text-white/80 font-medium mb-3 px-1">5-Day Forecast</h3>
      <div className="flex justify-between min-w-[300px] gap-4">
        {forecast.map((day, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 min-w-[60px] p-2 hover:bg-white/5 rounded-xl transition-colors">
            <span className="text-xs text-white/70 font-medium uppercase">{day.date.toLocaleDateString([], { weekday: 'short' })}</span>
            <div className="scale-90 transform transition-transform hover:scale-110">{getWeatherIcon(day.icon)}</div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-white">{Math.round(day.temp)}°</span>
              <span className="text-[10px] text-white/50 capitalize max-w-[60px] truncate text-center">{day.conditions}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
