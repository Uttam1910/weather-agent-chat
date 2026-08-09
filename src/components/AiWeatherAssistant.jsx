import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaLightbulb, FaUser, FaCheckCircle } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

export default function AiWeatherAssistant({ weatherData }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I'm your Weather Insights Assistant. Ask me anything about current conditions in ${weatherData?.location || 'your area'}, outfit recommendations, or travel advice!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'Should I carry an umbrella today?',
    'What should I wear for this weather?',
    'Is it safe for outdoor running or cycling?',
    'Will it rain in the evening?',
  ];

  const generateAnswer = (query) => {
    if (!weatherData) return "I don't have weather data loaded yet.";
    const q = query.toLowerCase();
    const { temperature, conditions, humidity, windSpeed, uvIndex, location } = weatherData;

    if (q.includes('umbrella') || q.includes('rain')) {
      if (conditions.toLowerCase().includes('rain') || conditions.toLowerCase().includes('drizzle')) {
        return `Yes, definitely take an umbrella! Current conditions in ${location} indicate ${conditions.toLowerCase()} with high probability of rain.`;
      }
      return `No umbrella needed right now! Weather in ${location} is ${conditions.toLowerCase()} with low risk of rain.`;
    }

    if (q.includes('wear') || q.includes('outfit') || q.includes('clothes')) {
      if (temperature > 28) {
        return `It's warm in ${location} (${temperature}°C)! Wear lightweight cotton clothes, sunglasses, and hat. Don't forget sunscreen!`;
      } else if (temperature < 15) {
        return `It's chilly (${temperature}°C). Wear a jacket, sweater, or warm windbreaker.`;
      }
      return `Comfortable weather (${temperature}°C). A casual t-shirt with a light cardigan or denim jacket will be ideal.`;
    }

    if (q.includes('run') || q.includes('cycling') || q.includes('outdoor') || q.includes('workout')) {
      if (windSpeed > 35) {
        return `High winds recorded (${windSpeed} km/h). Consider indoor workouts today.`;
      } else if (temperature > 32) {
        return `It's quite hot (${temperature}°C). If jogging, run early morning or after sunset and hydrate well!`;
      } else if (uvIndex >= 7) {
        return `High UV Index (${uvIndex}). Apply broad-spectrum sunscreen and wear UV protective eyewear.`;
      }
      return `Perfect conditions for outdoor activities! Moderate temperature (${temperature}°C) and pleasant breeze (${windSpeed} km/h).`;
    }

    return `For ${location}: Currently ${temperature}°C with ${conditions.toLowerCase()}. Humidity is ${humidity}%, wind speed is ${windSpeed} km/h, and UV index is ${uvIndex}. Let me know if you need specific travel or clothing tips!`;
  };

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    setTimeout(() => {
      const aiReply = generateAnswer(text);
      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
      setLoading(false);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4"
    >
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="p-3 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl text-white shadow-lg">
          <FaRobot className="text-xl animate-bounce" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Weather Insights Assistant <FaCheckCircle className="text-emerald-400 text-xs" />
          </h3>
          <p className="text-xs text-white/60">Instant answers, clothing advice & lifestyle tips</p>
        </div>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="flex flex-wrap gap-2 pt-1">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-xs bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-400/50 text-white/80 hover:text-white px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5"
          >
            <FaLightbulb className="text-amber-400 text-[10px]" />
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="h-[220px] overflow-y-auto space-y-3 p-3 bg-black/20 rounded-2xl border border-white/5 scrollbar-thin scrollbar-thumb-white/20">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 text-sm ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs flex-shrink-0">
                  <FaRobot />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none'
                    : 'bg-white/10 border border-white/10 text-white/90 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs flex-shrink-0">
                  <FaUser />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex gap-2 items-center text-xs text-white/50 pl-2">
            <ImSpinner8 className="animate-spin text-purple-400" />
            <span>Analyzing atmospheric parameters...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Weather Insights Assistant..."
          className="flex-1 bg-white/10 border border-white/15 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center"
        >
          <FaPaperPlane className="text-sm" />
        </button>
      </form>
    </motion.div>
  );
}
