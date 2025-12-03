import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export default function SEO({ title, description, keywords, image, type, schema }) {
  const location = useLocation();
  const siteUrl = 'https://weather-agent-chat.vercel.app'; // Replace with actual domain
  const currentUrl = `${siteUrl}${location.pathname}`;
  const defaultImage = `${siteUrl}/og-image.jpg`; // Ensure this image exists in public folder

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title} | Weather Agent</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type || 'website'} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

SEO.defaultProps = {
  title: 'Weather Agent',
  description: 'A modern, AI-powered weather application providing accurate forecasts and real-time weather updates.',
  keywords: 'weather, forecast, ai, react, weather app, real-time weather',
  type: 'website',
  image: null,
  schema: null,
};
