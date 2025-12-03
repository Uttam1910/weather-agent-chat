import { motion } from 'framer-motion';
import { WiDaySunny, WiStrongWind, WiHumidity, WiBarometer, WiSunrise, WiSunset } from 'react-icons/wi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WeatherDashboard({ weatherData, forecastData, aqiData }) {
  if (!weatherData) return null;

  const { location, description, temperature, feelsLike, humidity, windSpeed, pressure, sunrise, sunset, icon } = weatherData;
  
  // Format forecast data for graph
  const graphData = forecastData?.map(item => ({
    time: item.date.toLocaleDateString([], { weekday: 'short' }),
    temp: item.temp
  })) || [];

  const getAqiLabel = (aqi) => {
    const labels = { 1: 'Good', 2: 'Fair', 3: 'Moderate', 4: 'Poor', 5: 'Very Poor' };
    return labels[aqi] || 'Unknown';
  };

  const getAqiColor = (aqi) => {
    const colors = { 1: 'text-green-400', 2: 'text-yellow-400', 3: 'text-orange-400', 4: 'text-red-400', 5: 'text-purple-400' };
    return colors[aqi] || 'text-gray-400';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Top Section: Current Weather & Main Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-glass-200 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">{location}</h1>
              <p className="text-xl text-white/80 capitalize font-medium">{description}</p>
              <div className="mt-6 flex items-baseline gap-4">
                <span className="text-8xl font-bold text-white tracking-tighter">{Math.round(temperature)}°</span>
                <div className="flex flex-col">
                  <span className="text-xl text-white/60 font-medium">Feels like {Math.round(feelsLike)}°</span>
                  {aqiData && (
                    <span className={`text-sm font-bold ${getAqiColor(aqiData.main.aqi)} border border-white/10 px-2 py-1 rounded-full mt-2 inline-block text-center`}>
                      AQI: {getAqiLabel(aqiData.main.aqi)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Icon would go here, simplified for now */}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: WiStrongWind, label: 'Wind', value: `${windSpeed} km/h`, color: 'text-blue-300' },
            { icon: WiHumidity, label: 'Humidity', value: `${humidity}%`, color: 'text-cyan-300' },
            { icon: WiBarometer, label: 'Pressure', value: `${pressure} hPa`, color: 'text-green-300' },
            { icon: WiSunrise, label: 'Sunrise', value: sunrise?.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), color: 'text-yellow-300' },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-glass-100 backdrop-blur-lg rounded-3xl p-4 border border-white/10 flex flex-col items-center justify-center hover:bg-glass-200 transition-colors"
            >
              <stat.icon className={`text-4xl ${stat.color} mb-2`} />
              <span className="text-sm text-white/60">{stat.label}</span>
              <span className="text-lg font-bold text-white">{stat.value}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Forecast Graph */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-glass-100 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/20 shadow-xl"
      >
        <h3 className="text-xl font-bold text-white mb-6 px-2">Temperature Trend</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={graphData}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" tick={{fill: 'white'}} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'white'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', color: 'white' }}
                itemStyle={{ color: '#8884d8' }}
              />
              <Area type="monotone" dataKey="temp" stroke="#8884d8" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
