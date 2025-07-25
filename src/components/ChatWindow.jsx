// src/components/ChatWindow.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import { FaRobot, FaCloudSun, FaWind, FaTemperatureHigh } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';
import { IoWarning } from 'react-icons/io5';

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
  const THREAD_ID = import.meta.env.VITE_THREAD_ID;


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
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);
    setError(null);

    const payload = {
      messages: [{ role: "user", content: userMessage.content }],
      runId: "weatherAgent",
      maxRetries: 2,
      maxSteps: 5,
      temperature: 0.5,
      topP: 1,
      runtimeContext: {},
      threadId: THREAD_ID,
      resourceId: "weatherAgent",
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'x-mastra-dev-playground': 'true',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      if (!response.body) throw new Error('ReadableStream not supported');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let agentMessage = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("0:") || line.startsWith("f:") || line.startsWith("a:") || 
              line.startsWith("9:") || line.startsWith("e:") || line.startsWith("d:")) {
            try {
              const jsonPart = line.substring(2);
              const parsed = JSON.parse(jsonPart);

              if (typeof parsed === "string") {
                agentMessage += parsed;
              }

              if (parsed.result && parsed.result.conditions) {
                const { temperature, feelsLike, humidity, windSpeed, windGust, conditions, location } = parsed.result;
                agentMessage += `The current weather in ${location} is a ${conditions.toLowerCase()}. The temperature is ${temperature}°C but feels like ${feelsLike}°C due to the high humidity of ${humidity}%. Wind speed is ${windSpeed} km/h with gusts up to ${windGust} km/h.`;
              }
            } catch (err) {
              console.warn("Non-JSON or ignored line:", line);
            }
          }
        }

        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'agent') {
            return [...prev.slice(0, -1), { ...last, content: agentMessage, timestamp: new Date() }];
          } else {
            return [...prev, { role: 'agent', content: agentMessage, timestamp: new Date() }];
          }
        });
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to connect to weather service. Please try again later.');
      setMessages(prev => [...prev, {
        role: 'agent',
        content: "⚠️ I'm having trouble connecting to weather data. Please try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
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
  const formatWeatherData = (content) => {
    const regex = /The current weather in (.+?) is a (.+?)\. The temperature is (.+?)°C but feels like (.+?)°C due to the high humidity of (.+?)%. Wind speed is (.+?) km\/h with gusts up to (.+?) km\/h\./;
    const match = content.match(regex);
    
    if (match) {
      const [, location, conditions, temperature, feelsLike, humidity, windSpeed, windGust] = match;
      
      return (
        <div className="weather-card">
          <div className="weather-header">
            <div>
              <h3>{location}</h3>
              <p className="weather-condition">{conditions}</p>
            </div>
            <div className="weather-icon">
              {parseInt(temperature) > 25 ? <FaCloudSun /> : <FaTemperatureHigh />}
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
    }
    return content;
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
            onClick={() => setMessages([])}
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
                  {msg.role === 'agent' && msg.content.includes("The current weather") ? 
                    formatWeatherData(msg.content) : 
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
      
      {/* Inline CSS */}
      <style jsx>{`
        .chat-container {
          width: 100%;
          max-width: 48rem;
          height: 85vh;
          background: linear-gradient(to bottom, #f0f9ff, #e6f7ff);
          border-radius: 1.5rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #d1e9ff;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }
        
        .chat-header {
          background: linear-gradient(to right, #3b82f6, #6366f1);
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .header-icon {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem;
          border-radius: 0.75rem;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .header-icon svg {
          font-size: 1.25rem;
          color: white;
        }
        
        h2 {
          font-size: 1.125rem;
          font-weight: 700;
          margin: 0;
        }
        
        .status-indicator {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          margin: 0;
          opacity: 0.9;
        }
        
        .status-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background-color: #93c5fd;
          margin-right: 0.25rem;
        }
        
        .status-dot.typing {
          background-color: #34d399;
          animation: pulse 1.5s infinite;
        }
        
        .clear-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          padding: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }
        
        .clear-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }
        
        .clear-button svg {
          color: white;
          font-size: 1.25rem;
        }
        
        .messages-container {
          flex: 1;
          overflow-y: auto;
          background: linear-gradient(to bottom, rgba(240, 249, 255, 0.8), rgba(230, 247, 255, 0.8));
          position: relative;
          padding: 1.5rem 1rem;
        }
        
        .messages-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(at top right, rgba(147, 197, 253, 0.1) 0%, transparent 70%),
            radial-gradient(at bottom left, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        
        .welcome-screen {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 1.5rem;
          position: relative;
          z-index: 10;
        }
        
        .welcome-icon {
          background: linear-gradient(to right, #3b82f6, #6366f1);
          width: 5rem;
          height: 5rem;
          border-radius: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          animation: float 3s ease-in-out infinite;
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.2);
        }
        
        .welcome-icon svg {
          font-size: 2.5rem;
          color: white;
        }
        
        h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #3b82f6, #6366f1);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .welcome-screen p {
          color: #4b5563;
          max-width: 28rem;
          margin-bottom: 2rem;
          font-size: 1rem;
        }
        
        .example-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          width: 100%;
          max-width: 28rem;
        }
        
        .example-button {
          background: white;
          border: 1px solid #dbeafe;
          border-radius: 0.75rem;
          padding: 0.75rem;
          text-align: left;
          font-size: 0.875rem;
          color: #4b5563;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          animation: fadeIn 0.5s ease-out;
          animation-fill-mode: both;
        }
        
        .example-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
          border-color: #93c5fd;
          background: #eff6ff;
        }
        
        .example-icon {
          background: #dbeafe;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.5rem;
          flex-shrink: 0;
        }
        
        .example-icon svg {
          font-size: 0.75rem;
          color: #3b82f6;
        }
        
        .messages-area {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
          z-index: 10;
        }
        
        .message-wrapper {
          display: flex;
          animation: fadeIn 0.3s ease-out;
        }
        
        .message-wrapper.user-message {
          justify-content: flex-end;
        }
        
        .message-wrapper.agent-message {
          justify-content: flex-start;
        }
        
        .message-bubble {
          max-width: 85%;
          padding: 0.875rem 1.25rem;
          border-radius: 1.25rem;
          font-size: 0.95rem;
          line-height: 1.5;
          position: relative;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          animation: slideIn 0.3s ease-out;
        }
        
        .user-bubble {
          background: linear-gradient(to right, #3b82f6, #6366f1);
          color: white;
          border-bottom-right-radius: 0.25rem;
        }
        
        .agent-bubble {
          background: white;
          color: #4b5563;
          border: 1px solid #e5e7eb;
          border-bottom-left-radius: 0.25rem;
        }
        
        .message-timestamp {
          font-size: 0.65rem;
          text-align: right;
          margin-top: 0.25rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .weather-card {
          background: linear-gradient(to bottom, #f0f9ff, #e6f7ff);
          border-radius: 1rem;
          padding: 1.25rem;
          border: 1px solid #dbeafe;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .weather-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        
        .weather-header h3 {
          font-size: 1.25rem;
          margin: 0;
          background: linear-gradient(to right, #3b82f6, #6366f1);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .weather-condition {
          font-size: 0.9rem;
          color: #4b5563;
          text-transform: capitalize;
          margin-top: 0.25rem;
        }
        
        .weather-icon {
          font-size: 2rem;
          color: #3b82f6;
        }
        
        .weather-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        
        .weather-metric {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .metric-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .temp-icon, .feels-icon, .humidity-icon, .wind-icon {
          background: #dbeafe;
          color: #3b82f6;
        }
        
        .metric-label {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0;
        }
        
        .metric-value {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        
        .typing-indicator {
          display: flex;
          align-items: flex-start;
          animation: fadeIn 0.3s ease-out;
        }
        
        .typing-bubble {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 1.25rem;
          padding: 0.75rem 1.25rem;
          border-bottom-left-radius: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .typing-dots {
          display: flex;
          gap: 0.25rem;
        }
        
        .dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background-color: #6b7280;
          animation: bounce 1.5s infinite;
        }
        
        .dot:nth-child(2) {
          animation-delay: 0.15s;
        }
        
        .dot:nth-child(3) {
          animation-delay: 0.3s;
        }
        
        .typing-text {
          font-size: 0.9rem;
          color: #6b7280;
        }
        
        .error-message {
          background: #fef2f2;
          border-top: 1px solid #fee2e2;
          padding: 0.75rem 1rem;
          color: #b91c1c;
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          animation: fadeIn 0.3s ease-out;
        }
        
        .error-message svg {
          margin-right: 0.5rem;
          flex-shrink: 0;
        }
        
        .input-area {
          padding: 1rem;
          background: white;
          border-top: 1px solid #e5e7eb;
        }
        
        .input-wrapper {
          display: flex;
          align-items: flex-end;
          gap: 0.75rem;
        }
        
        .message-input {
          flex: 1;
          padding: 0.875rem 1.25rem;
          border-radius: 1rem;
          background: white;
          color: #4b5563;
          border: 1px solid #d1d5db;
          resize: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
          font-family: inherit;
          font-size: 0.95rem;
          max-height: 9rem;
          outline: none;
        }
        
        .message-input:focus {
          border-color: #93c5fd;
          box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.3);
        }
        
        .message-input::placeholder {
          color: #9ca3af;
        }
        
        .send-button {
          height: 3rem;
          width: 3rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }
        
        .send-button:not(.disabled) {
          background: linear-gradient(to right, #3b82f6, #6366f1);
          color: white;
        }
        
        .send-button.disabled {
          background: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
        }
        
        .send-button:not(.disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 14px rgba(0, 0, 0, 0.15);
        }
        
        .send-button svg {
          font-size: 1.25rem;
        }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        .input-hint {
          font-size: 0.75rem;
          color: #9ca3af;
          text-align: center;
          margin-top: 0.5rem;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.5;
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        .example-button:nth-child(1) { animation-delay: 0.1s; }
        .example-button:nth-child(2) { animation-delay: 0.2s; }
        .example-button:nth-child(3) { animation-delay: 0.3s; }
        .example-button:nth-child(4) { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
}