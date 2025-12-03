import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';
import { FaCalendar, FaClock, FaUser } from 'react-icons/fa';

export default function Blog() {
  return (
    <div className="min-h-screen pt-24 pb-10 px-4">
      <SEO 
        title="Weather Blog | Insights & Updates"
        description="Read the latest articles about weather, climate, and technology from our experts."
      />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Weather Insights</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Discover the latest stories, tips, and technology behind modern weather forecasting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Link 
              to={`/blog/${post.id}`} 
              key={post.id}
              className="group bg-glass-100 rounded-3xl overflow-hidden border border-white/10 hover:bg-glass-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/20 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-blue-300 mb-3">
                  <span className="bg-blue-500/20 px-2 py-1 rounded-full">{post.category}</span>
                  <span className="flex items-center gap-1"><FaClock /> {post.readTime}</span>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-white/60 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-white/40 border-t border-white/10 pt-4">
                  <span className="flex items-center gap-2">
                    <FaUser /> {post.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaCalendar /> {post.date}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
