import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  structuredData?: object;
}

const SEOHead = ({
  title = "Daan Hessen - Full Stack Developer & HBO-ICT Student | Portfolio",
  description = "Daan Hessen - 23-year-old Full Stack Developer and HBO-ICT student at Hogeschool Utrecht. Specialized in React, TypeScript, JavaScript, Java, and Python. View my portfolio of modern web applications and projects.",
  keywords = "Daan Hessen, Full Stack Developer, Web Developer, React Developer, TypeScript, JavaScript, Java, Python, HBO-ICT, Hogeschool Utrecht, Portfolio, Frontend Developer, Backend Developer, Software Engineer, Netherlands",
  ogImage = "https://daanhessen.nl/og-image.jpg",
  ogType = "website",
  canonical = "https://daanhessen.nl",
  structuredData,
}: SEOHeadProps) => {
  return (
    <Helmet>
      {/* Primary SEO Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
