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
  title = "Daan Hessen - Developer & HBO-ICT Student | Portfolio",
  description = "Student and developer (don't have much to say, just take a look...)",
  keywords = "Daan Hessen, HBO-ICT, Hogeschool Utrecht, Portfolio, Frontend Developer, Backend Developer, Netherlands, Dutch, English, German",
  ogImage = "https://daanhessen.nl/og-image.jpg",
  ogType = "website",
  canonical = "https://daanhessen.nl",
  structuredData,
}: SEOHeadProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <link rel="canonical" href={canonical} />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
