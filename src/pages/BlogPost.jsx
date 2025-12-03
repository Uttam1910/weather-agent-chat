import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';
import { FaArrowLeft, FaCalendar, FaClock, FaUser, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { useEffect } from 'react';

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.id === parseInt(id));

  useEffect(() => {
    if (!post) {
      navigate('/blog');
    }
    window.scrollTo(0, 0);
  }, [post, navigate]);

  if (!post) return null;

  return (
    <div className="min-h-screen pt-24 pb-10 px-4">
      <SEO 
        title={`${post.title} | Weather Agent Blog`}
        description={post.excerpt}
      />
      
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <FaArrowLeft /> Back to Blog
        </Link>

        <article className="bg-glass-100 rounded-[2rem] overflow-hidden border border-white/10 animate-fadeIn">
          <div className="h-[400px] relative">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
              <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
                <span className="flex items-center gap-2">
                  <FaUser className="text-blue-400" /> {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <FaCalendar className="text-blue-400" /> {post.date}
                </span>
                <span className="flex items-center gap-2">
                  <FaClock className="text-blue-400" /> {post.readTime}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div 
              className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-white/80 prose-a:text-blue-400 hover:prose-a:text-blue-300"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-white/60 font-medium">Share this article:</p>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-blue-600 flex items-center justify-center text-white transition-all">
                  <FaFacebook />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-blue-400 flex items-center justify-center text-white transition-all">
                  <FaTwitter />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-blue-700 flex items-center justify-center text-white transition-all">
                  <FaLinkedin />
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
