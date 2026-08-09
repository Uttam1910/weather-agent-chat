import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WeatherThemeBackground from './components/WeatherThemeBackground';
import { trackPageView } from './admin/analytics/tracker';
import { ImSpinner8 } from 'react-icons/im';

// Lazy Load Public Pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const CityDetails = lazy(() => import('./pages/CityDetails'));
const Compare = lazy(() => import('./pages/Compare'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

// Lazy Load Private Admin System
const AdminSystem = lazy(() => import('./admin/AdminSystem'));

const ADMIN_ROUTE_PATH = import.meta.env.VITE_ADMIN_PATH || '/private-weather-control';

// Page View Tracker Component
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.startsWith(ADMIN_ROUTE_PATH)) {
      trackPageView(location.pathname);
    }
  }, [location]);

  return null;
}

// App Layout Wrapper to hide public Navbar/Footer on Admin Routes
function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith(ADMIN_ROUTE_PATH);

  if (isAdminRoute) {
    return (
      <main className="min-h-screen bg-slate-950">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path={`${ADMIN_ROUTE_PATH}/*`} element={<AdminSystem />} />
          </Routes>
        </Suspense>
      </main>
    );
  }

  return (
    <div className="min-h-screen text-white font-sans flex flex-col relative">
      <PageViewTracker />
      {/* Dynamic Animated Background */}
      <WeatherThemeBackground />

      {/* Header Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow relative z-10">
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

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Loading Fallback Component
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <ImSpinner8 className="text-4xl text-purple-400 animate-spin" />
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <UserProvider>
          <Router>
            <AppLayout />
          </Router>
        </UserProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
