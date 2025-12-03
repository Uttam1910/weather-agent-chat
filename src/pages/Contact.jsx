import SEO from '../components/SEO';
import { FaEnvelope, FaTwitter, FaGithub, FaMapMarkerAlt } from 'react-icons/fa';

export default function Contact() {
  return (
    <div className="min-h-screen pt-24 pb-10 px-4">
      <SEO title="Contact Us" description="Get in touch with the Weather Agent team." />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-glass-100 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-8 md:p-12 shadow-2xl animate-fadeIn">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Get in Touch</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <p className="text-white/70 leading-relaxed">
                Have questions or suggestions? We'd love to hear from you. Reach out to us through any of the following channels.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-white/80">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <FaEnvelope className="text-xl text-blue-400" />
                  </div>
                  <span>hello@weatheragent.com</span>
                </div>
                <div className="flex items-center gap-4 text-white/80">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-xl text-purple-400" />
                  </div>
                  <span>123 Weather St, Cloud City</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white">
                  <FaTwitter />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white">
                  <FaGithub />
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors resize-none"
                  placeholder="How can we help?"
                />
              </div>
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:-translate-y-0.5">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
