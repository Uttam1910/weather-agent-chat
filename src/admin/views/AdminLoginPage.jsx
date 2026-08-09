import { useState } from 'react';
import { useAdminAuth } from '../auth/AdminAuthContext';
import { FaShieldAlt, FaLock, FaUser, FaExclamationTriangle } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

export default function AdminLoginPage() {
  const { login, lockoutUntil } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setError(null);
    setLoading(true);

    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const isLocked = lockoutUntil && Date.now() < lockoutUntil;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans text-slate-100 selection:bg-purple-600 selection:text-white">
      {/* Noindex SEO Meta */}
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-800 to-purple-900 border border-slate-700/60 flex items-center justify-center mx-auto text-purple-400 text-2xl shadow-xl">
            <FaShieldAlt />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Weather Agent</h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Private Administration & Operations Center</p>
          </div>
        </div>

        {/* Login Form Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          {error && (
            <div className="bg-rose-950/60 border border-rose-800/60 rounded-2xl p-4 flex items-center gap-3 text-rose-300 text-xs font-medium">
              <FaExclamationTriangle className="text-base flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <FaUser className="text-slate-500" /> Username / Administrator ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLocked || loading}
                placeholder="Enter admin username..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <FaLock className="text-slate-500" /> Secure Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked || loading}
                placeholder="Enter password..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLocked || loading || !username || !password}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <ImSpinner8 className="animate-spin text-base" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <span>Sign In to Admin System</span>
              )}
            </button>
          </form>
        </div>

        <div className="text-center text-[11px] text-slate-600 font-medium">
          Protected System — Unauthorized access is prohibited.
        </div>
      </div>
    </div>
  );
}
