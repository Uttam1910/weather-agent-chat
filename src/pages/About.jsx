import SEO from '../components/SEO';
import { FaReact, FaWind, FaCode, FaChartLine } from 'react-icons/fa';
import { SiVite, SiTailwindcss } from 'react-icons/si';
import { WiDaySunny } from 'react-icons/wi';

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-10 px-4">
      <SEO title="About Weather Agent" description="Learn more about the Weather Agent Weather Intelligence Platform." />

      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 p-8 md:p-12 shadow-2xl animate-fadeIn">
          <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">About Weather Agent</h1>

          <div className="space-y-6 text-white/80 leading-relaxed text-base">
            <p>
              Weather Agent is a deterministic Weather Intelligence & Decision Support Platform. Rather than simply displaying raw temperature numbers, it calculates what physical weather parameters mean for outdoor activities, travel, commuting, events, and daily planning.
            </p>

            <p>
              Operating on real-time Open-Meteo atmospheric metrics, our explainable decision algorithms evaluate 15+ outdoor activity suitability scores, comfort indices, and travel risks with zero reliance on opaque AI models or placeholder data.
            </p>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FaCode className="text-purple-400" />
              Technology Architecture
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: FaReact, name: 'React 19', color: 'text-blue-400' },
                { icon: SiVite, name: 'Vite', color: 'text-purple-400' },
                { icon: SiTailwindcss, name: 'Tailwind CSS', color: 'text-cyan-400' },
                { icon: WiDaySunny, name: 'Open-Meteo APIs', color: 'text-amber-400' },
                { icon: FaChartLine, name: 'Recharts', color: 'text-indigo-400' },
                { icon: FaWind, name: 'Framer Motion', color: 'text-rose-400' },
              ].map((tech, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:bg-white/10 transition-colors">
                  <tech.icon className={`text-2xl ${tech.color}`} />
                  <span className="text-white font-medium text-sm">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
