import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export default function SEO({ title, description, keywords, image, type }) {
  const location = useLocation();
  const siteUrl = 'https://weather-agent-chat.vercel.app';
  const currentUrl = `${siteUrl}${location.pathname}`;
  const defaultImage = `${siteUrl}/favicon.svg`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title || 'Weather Agent',
    url: currentUrl,
    description: description || 'Real-time weather forecast application with 24-hour charts, AQI monitoring, and AI weather agent.',
    applicationCategory: 'WeatherApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title} | Weather Agent</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords || 'weather agent, live forecast, 24h weather chart, air quality index, Open-Meteo, weather app'} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type || 'website'} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={`${title} | Weather Agent`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={`${title} | Weather Agent`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}

SEO.defaultProps = {
  title: 'Weather Agent - Live Forecasts & AI Insights',
  description: 'Experience real-time weather forecasting with Weather Agent. Features live Open-Meteo updates, 24-hour interactive graphs, AQI air quality monitoring, and AI weather recommendations.',
  keywords: 'weather, forecast, air quality index, hourly weather chart, weather AI agent, Open-Meteo, weather comparison',
  type: 'website',
  image: null,
};
