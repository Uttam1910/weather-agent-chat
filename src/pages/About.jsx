import SEO from '../components/SEO';
import { FaReact, FaWind, FaCode } from 'react-icons/fa';
import { SiVite, SiTailwindcss } from 'react-icons/si';
import { WiDaySunny } from 'react-icons/wi';

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-10 px-4">
      <SEO title="About" description="Learn more about the Weather Agent project and the technologies used." />
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-glass-100 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-8 md:p-12 shadow-2xl animate-fadeIn">
          <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">About Weather Agent</h1>
          
          <div className="space-y-6 text-white/80 leading-relaxed text-lg">
            <p>
              Weather Agent is a modern, AI-powered weather application designed to provide accurate forecasts with a beautiful, immersive user experience. 
              Built with the latest web technologies, it aims to make checking the weather a delightful daily ritual.
            </p>
            
            <p>
              Our "Medical Magic" aesthetic combines clean, clinical precision with ethereal, glassmorphic design elements, creating an interface that feels both professional and enchanting.
            </p>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FaCode className="text-blue-400" />
              Tech Stack
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: FaReact, name: 'React 19', color: 'text-blue-400' },
                { icon: SiVite, name: 'Vite', color: 'text-purple-400' },
                { icon: SiTailwindcss, name: 'Tailwind CSS', color: 'text-cyan-400' },
                { icon: WiDaySunny, name: 'OpenWeather API', color: 'text-orange-400' },
                { icon: FaWind, name: 'React Icons', color: 'text-pink-400' },
              ].map((tech, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:bg-white/10 transition-colors">
                  <tech.icon className={`text-2xl ${tech.color}`} />
                  <span className="text-white font-medium">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
