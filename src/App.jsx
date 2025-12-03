import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ImSpinner8 } from 'react-icons/im';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const CityDetails = lazy(() => import('./pages/CityDetails'));
const Compare = lazy(() => import('./pages/Compare'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <ImSpinner8 className="text-4xl text-white animate-spin" />
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <UserProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white font-sans selection:bg-purple-500/30 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/weather/:city" element={<CityDetails />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogPost />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </UserProvider>
    </HelmetProvider>
  );
}
