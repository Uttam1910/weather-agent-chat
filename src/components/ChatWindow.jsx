// ChatWindow.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import MessageBubble from './MessageBubble';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

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
          if (line.startsWith("0:") || line.startsWith("f:") || line.startsWith("a:") || line.startsWith("9:") || line.startsWith("e:") || line.startsWith("d:")) {
            try {
              const jsonPart = line.substring(2);
              const parsed = JSON.parse(jsonPart);

              // If it's a text token
              if (typeof parsed === "string") {
                agentMessage += parsed;
              }

              // If it's a tool result response
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
    <div className="w-full max-w-2xl h-[80vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-700 to-blue-600 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <FaRobot className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Weather Assistant</h2>
            <p className="text-blue-100 text-xs">{isTyping ? 'Typing...' : 'Online'}</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([])}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
          title="Clear chat"
        >
          <FiTrash2 className="text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-b from-gray-50 to-gray-100">
        {messages.length === 0 && !isTyping ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-500">
            <FaRobot className="text-4xl text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ask me about the weather</h3>
            <p className="max-w-md">
              Examples: "What's the weather in Mumbai?" or "Will it rain tomorrow in Pune?"
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} role={msg.role} content={msg.content} />
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2">
                <div className="bg-gray-200 border-2 border-white w-8 h-8 rounded-full flex items-center justify-center">
                  <FaRobot className="text-gray-600" />
                </div>
                <div className="bg-gray-200 rounded-xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-2 text-center text-sm">{error}</div>
      )}

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            rows={1}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="h-12 w-12 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isLoading ? <ImSpinner8 className="animate-spin" /> : <FiSend />}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">Press Enter to send, Shift+Enter for new line</div>
      </div>
    </div>
  );
}
