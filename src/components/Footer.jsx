import { Link } from 'react-router-dom';
import { WiDaySunny } from 'react-icons/wi';
import { FaHeart, FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-slate-950/60 backdrop-blur-2xl text-white/70 py-12 px-4 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Description */}
        <div className="space-y-4 md:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white">
              <WiDaySunny className="text-xl" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Weather Agent</span>
          </Link>
          <p className="text-xs text-white/60 leading-relaxed">
            Real-time weather insights, 24-hour hourly graphs, air quality monitoring, and weather decision intelligence powered by Open-Meteo.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm mb-3">Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="hover:text-white transition-colors">Home Dashboard</Link></li>
            <li><Link to="/compare" className="hover:text-white transition-colors">Compare Cities</Link></li>
            <li><Link to="/blog" className="hover:text-white transition-colors">Weather Blog & News</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Project</Link></li>
          </ul>
        </div>

        {/* Support & Legal */}
        <div>
          <h4 className="text-white font-bold text-sm mb-3">Help & Support</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            <li><span className="text-white/40">API Status: Operational</span></li>
            <li><span className="text-white/40">Data Provider: Open-Meteo</span></li>
          </ul>
        </div>

        {/* Social & Newsletter */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm">Stay Weather Prepared</h4>
          <p className="text-xs text-white/60">Get instant local forecast alerts and weather advice anytime.</p>
          <div className="flex gap-3 text-lg text-white/60">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <FaGithub />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <FaTwitter />
            </a>
            <a href="mailto:support@weatheragent.com" className="hover:text-white transition-colors">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-white/50 gap-2">
        <span>© {new Date().getFullYear()} Weather Agent. All rights reserved.</span>
        <span className="flex items-center gap-1">
          Crafted with <FaHeart className="text-rose-400 text-xs" /> for weather enthusiasts worldwide.
        </span>
      </div>
    </footer>
  );
}
