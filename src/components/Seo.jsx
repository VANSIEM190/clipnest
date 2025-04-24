// src/components/Seo.jsx
import { Helmet } from "react-helmet";

const Seo = ({ 
  title = "ClipNest - Forum éducatif", 
  description = "ClipNest est une plateforme éducative où les étudiants peuvent discuter, poser des questions et apprendre ensemble.",
  url
}) => {
  return (
    <Helmet>
      {/* Meta de base */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default Seo;
