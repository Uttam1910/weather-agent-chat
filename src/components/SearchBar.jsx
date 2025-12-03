import { useState } from 'react';
import { FiSearch, FiLoader } from 'react-icons/fi';

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto relative z-20">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-30 group-hover:opacity-50 blur transition duration-200"></div>
        <div className="relative flex items-center bg-glass-100 backdrop-blur-xl border border-white/20 rounded-full shadow-lg">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city (e.g., London, Tokyo)..."
            className="w-full bg-transparent text-white placeholder-white/40 border-none outline-none px-6 py-4 rounded-full"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <FiLoader className="animate-spin" /> : <FiSearch />}
          </button>
        </div>
      </div>
    </form>
  );
}
