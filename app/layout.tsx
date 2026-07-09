import type { Metadata } from "next";
import "./globals.css";
import "./styles/components.css";
import AgentationWrapper from "@/components/layout/AgentationWrapper";
import { Instrument_Sans } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// Use Instrument Sans for serif as well since the brand book specifies it as the primary typeface
const instrumentSerif = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parmar Properties | Luxury Real Estate",
  description: "South Mumbai's premier real estate consultancy. Curating exceptional homes since 1994.",
  keywords: ["Luxury Real Estate", "South Mumbai", "Worli", "Properties", "Parmar Properties"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://parmarproperties.com'),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title: "Parmar Properties | Luxury Real Estate",
    description: "South Mumbai's premier real estate consultancy. Curating exceptional homes since 1994.",
    siteName: "Parmar Properties",
    images: [
      {
        url: "/og-image.jpg", // We will assume an og-image.jpg exists or will be added
        width: 1200,
        height: 630,
        alt: "Parmar Properties - Luxury Real Estate",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parmar Properties | Luxury Real Estate",
    description: "South Mumbai's premier real estate consultancy. Curating exceptional homes since 1994.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${instrumentSerif.variable}`}>
      <body>
        {children}
        <AgentationWrapper />
      </body>
    </html>
  );
}
