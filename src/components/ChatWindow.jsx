// src/components/ChatWindow.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import { FaRobot, FaCloudSun, FaWind, FaTemperatureHigh } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';
import { IoWarning } from 'react-icons/io5';
import { extractCityFromMessage, fetchWeatherData, generateWeatherMessage } from '../utils/weatherApi';
import './ChatWindow.css';

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setIsLoading(true);
    setIsTyping(true);
    setError(null);

    // Create abort controller for cleanup
    abortControllerRef.current = new AbortController();

    try {
      // Extract city name from user message
      const city = extractCityFromMessage(userInput);
      
      if (!city) {
        // If no city found, provide helpful response
        setMessages(prev => [...prev, {
          role: 'agent',
          content: "I can help you get weather information! Please tell me which city you'd like to know about. For example:\n• \"Weather in Mumbai\"\n• \"What's the weather in Delhi?\"\n• \"Temperature in Bangalore\"",
          timestamp: new Date(),
        }]);
        setIsTyping(false);
        setIsLoading(false);
        return;
      }

      console.log('[Weather] Fetching weather for city:', city);

      // Fetch weather data from OpenWeatherMap
      const weatherData = await fetchWeatherData(city);
      console.log('[Weather] Received data:', weatherData);

      // Generate friendly message
      const weatherMessage = generateWeatherMessage(weatherData);
      
      // Store weather data for display
      const agentMessage = {
        role: 'agent',
        content: weatherMessage,
        weatherData: weatherData, // Store full data for weather card
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, agentMessage]);

    } catch (err) {
      console.error('[Weather] Error:', err);
      const errorMessage = err.message || 'Failed to fetch weather data. Please try again.';
      setError(errorMessage);
      setMessages(prev => [...prev, {
        role: 'agent',
        content: `❌ ${errorMessage}\n\nPlease check the city name and try again.`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [input, isLoading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Format weather data into cards
  const formatWeatherData = (weatherData) => {
    if (!weatherData || typeof weatherData !== 'object') {
      return null;
    }

    const { location, conditions, temperature, feelsLike, humidity, windSpeed, windGust } = weatherData;
    
    return (
      <div className="weather-card">
        <div className="weather-header">
          <div>
            <h3>{location}</h3>
            <p className="weather-condition">{conditions}</p>
          </div>
          <div className="weather-icon">
            {temperature > 25 ? <FaCloudSun /> : <FaTemperatureHigh />}
          </div>
        </div>
        
        <div className="weather-grid">
          <div className="weather-metric">
            <div className="metric-icon temp-icon">
              <FaTemperatureHigh />
            </div>
            <div>
              <p className="metric-label">Temperature</p>
              <p className="metric-value">{temperature}°C</p>
            </div>
          </div>
          
          <div className="weather-metric">
            <div className="metric-icon feels-icon">
              <FaTemperatureHigh />
            </div>
            <div>
              <p className="metric-label">Feels Like</p>
              <p className="metric-value">{feelsLike}°C</p>
            </div>
          </div>
          
          <div className="weather-metric">
            <div className="metric-icon humidity-icon">
              <FaTemperatureHigh />
            </div>
            <div>
              <p className="metric-label">Humidity</p>
              <p className="metric-value">{humidity}%</p>
            </div>
          </div>
          
          <div className="weather-metric">
            <div className="metric-icon wind-icon">
              <FaWind />
            </div>
            <div>
              <p className="metric-label">Wind</p>
              <p className="metric-value">{windSpeed} km/h</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <div className="header-icon">
            <FaRobot />
          </div>
          <div>
            <h2>Weather Assistant</h2>
            <p className="status-indicator">
              <span className={`status-dot ${isTyping ? 'typing' : ''}`}></span>
              {isTyping ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        <div>
          <button 
            onClick={() => {
              setMessages([]);
              setError(null);
            }}
            className="clear-button"
            title="Clear chat"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {/* Chat messages area */}
      <div className="messages-container">
        {messages.length === 0 && !isTyping ? (
          <div className="welcome-screen">
            <div className="welcome-icon">
              <FaRobot />
            </div>
            <h3>Weather Forecast Assistant</h3>
            <p>
              Get real-time weather updates and forecasts for any location worldwide
            </p>
            <div className="example-grid">
              {["What's the weather in Mumbai?", "Will it rain tomorrow in Pune?", "Weather in Delhi", "Humidity in Bangalore"].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setInput(example)}
                  className="example-button"
                >
                  <div className="example-icon">
                    <FaCloudSun />
                  </div>
                  {example}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages-area">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`message-wrapper ${msg.role === 'user' ? 'user-message' : 'agent-message'}`}
              >
                <div 
                  className={`message-bubble ${msg.role === 'user' ? 'user-bubble' : 'agent-bubble'}`}
                >
                  {msg.role === 'agent' && msg.weatherData ? 
                    formatWeatherData(msg.weatherData) : 
                    msg.content
                  }
                  
                  {msg.role === 'user' && (
                    <div className="message-timestamp">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-bubble">
                  <div className="typing-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                  <span className="typing-text">Getting weather data...</span>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <div className="error-message">
          <IoWarning />
          {error}
        </div>
      )}

      {/* Input area */}
      <div className="input-area">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about weather in your city..."
            rows={1}
            className="message-input"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className={`send-button ${isLoading || !input.trim() ? 'disabled' : ''}`}
          >
            {isLoading ? <ImSpinner8 className="spinner" /> : <FiSend />}
          </button>
        </div>
        <div className="input-hint">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
