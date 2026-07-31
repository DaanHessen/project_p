import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  structuredData?: object;
  noindex?: boolean;
}

const SEOHead = ({
  title = "Daan Hessen - Developer & HBO-ICT Student | Portfolio",
  description = "Student and developer (don't have much to say, just take a look...)",
  keywords = "Daan Hessen, HBO-ICT, Hogeschool Utrecht, Portfolio, Frontend Developer, Backend Developer, Netherlands, Dutch, English, German",
  ogImage = "https://daanhessen.nl/og-image.jpg",
  ogType = "website",
  canonical = "https://daanhessen.nl",
  structuredData,
  noindex = false,
}: SEOHeadProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {/*
        Robots lives here rather than in index.html. A static tag there would
        not be replaced by this one, leaving /cv with two conflicting
        directives.
      */}
      <meta
        name="robots"
        content={
          noindex
            ? "noindex, follow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />

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
