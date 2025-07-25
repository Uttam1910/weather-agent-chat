// MessageBubble.jsx
import { FaRegUser } from 'react-icons/fa';
import { FaRobot } from 'react-icons/fa';

export default function MessageBubble({ role, content }) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
      <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? 'flex-row-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'}`}>
          {isUser ? <FaRegUser /> : <FaRobot />}
        </div>
        <div className={`rounded-xl p-3 text-sm whitespace-pre-line shadow-md ${isUser ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-200 text-gray-900 rounded-tl-none'}`}>
          {content}
        </div>
      </div>
    </div>
  );
}