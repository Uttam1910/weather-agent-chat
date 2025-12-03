import { FaGithub, FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full py-10 mt-auto border-t border-white/10 bg-glass-100 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4">Weather Agent</h3>
            <p className="text-white/60 text-sm">
              Advanced AI-powered weather forecasting with a magical interface.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/compare" className="hover:text-white transition-colors">Compare Cities</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors">
                <FaGithub className="text-xl" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors">
                <FaHeart className="text-xl text-red-400" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-sm">
          <p>© {new Date().getFullYear()} Weather Agent. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <FaHeart className="text-red-400 animate-pulse" />
            <span>using React & OpenWeatherMap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
