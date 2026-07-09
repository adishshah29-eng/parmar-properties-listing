import { SavedHomesProvider } from "./_providers/SavedHomesProvider";
import SavedHomesDrawer from "@/components/common/SavedHomesDrawer";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Parmar Properties",
    "image": "https://parmarproperties.com/og-image.jpg",
    "url": "https://parmarproperties.com",
    "telephone": "+919876543210",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "priceRange": "$$$$"
  };

  return (
    <SavedHomesProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      {children}
      <Footer />
      <SavedHomesDrawer />
    </SavedHomesProvider>
  );
}
