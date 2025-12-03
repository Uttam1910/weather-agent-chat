import { IoWarning } from 'react-icons/io5';

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="w-full max-w-md mx-auto animate-fadeIn">
      <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
        <IoWarning className="text-red-400 text-xl flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-red-200 font-medium text-sm mb-1">Something went wrong</h3>
          <p className="text-red-100/80 text-sm leading-relaxed">{message}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="mt-3 text-xs font-medium text-red-300 hover:text-red-200 underline transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
