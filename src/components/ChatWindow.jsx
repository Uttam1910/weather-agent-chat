// src/components/ChatWindow.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';
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

  const API_ENDPOINT = "https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream";
  const THREAD_ID = "2021016402219961";

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
            return [...prev.slice(0, -1), { ...last, content: agentMessage }];
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

  return (
    <div className="w-full max-w-3xl h-[85vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FaRobot className="text-blue-600 text-xl" />
          </div>
          <div>
            <h2 className="text-gray-800 font-semibold text-lg">Weather Assistant</h2>
            <p className="text-gray-500 text-sm flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${isTyping ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></span>
              {isTyping ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setMessages([])}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Clear chat"
          >
            <FiTrash2 className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {messages.length === 0 && !isTyping ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-5">
              <FaRobot className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Ask me about the weather</h3>
            <p className="text-gray-500 max-w-md mb-6">
              Get real-time weather updates for any location
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
              {["What's the weather in Mumbai?", "Will it rain tomorrow in Pune?", "Weather in Delhi", "Humidity in Bangalore"].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setInput(example)}
                  className="bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors shadow-sm text-left"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 px-4 py-6">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div 
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start animate-fadeIn">
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 rounded-bl-none">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-t border-red-100 p-3 text-red-700 flex items-center text-sm animate-fadeIn">
          <IoWarning className="mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Input area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about weather in your city..."
            rows={1}
            className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 border border-gray-200 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className={`h-12 w-12 rounded-full flex items-center justify-center shadow transition-all ${
              isLoading || !input.trim() 
                ? 'bg-gray-200 text-gray-400' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            {isLoading ? <ImSpinner8 className="animate-spin" /> : <FiSend />}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}