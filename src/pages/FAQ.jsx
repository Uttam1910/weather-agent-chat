import { useState } from 'react';
import SEO from '../components/SEO';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    question: "Where does the weather data come from?",
    answer: "We use the OpenWeatherMap API, a trusted source for global weather data, providing accurate current conditions and forecasts."
  },
  {
    question: "Is this service free to use?",
    answer: "Yes! Weather Agent is completely free to use for checking weather conditions and forecasts worldwide."
  },
  {
    question: "How accurate is the Air Quality Index?",
    answer: "The AQI is calculated based on real-time pollutant concentrations (PM2.5, PM10, NO2, etc.) provided by global monitoring stations."
  },
  {
    question: "Can I save my favorite cities?",
    answer: "Yes, you can add cities to your favorites list for quick access. Your preferences are saved locally on your device."
  },
  {
    question: "Does it work on mobile devices?",
    answer: "Absolutely! Weather Agent is fully responsive and optimized for a great experience on smartphones, tablets, and desktops."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen pt-24 pb-10 px-4">
      <SEO title="FAQ" description="Frequently Asked Questions about Weather Agent." />
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h1>
        
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-glass-100 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-colors hover:bg-glass-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="text-lg font-medium text-white">{faq.question}</span>
                <span className="text-white/60">
                  {openIndex === idx ? <FiMinus /> : <FiPlus />}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4 text-white/70 leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
