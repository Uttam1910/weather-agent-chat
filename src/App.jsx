// src/App.jsx
import ChatWindow from './components/ChatWindow';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl overflow-hidden">
        <header className="bg-blue-600 text-white text-center py-4 text-2xl font-semibold">
          Weather Agent Chat
        </header>
        <ChatWindow />
      </div>
    </div>
  );
}
