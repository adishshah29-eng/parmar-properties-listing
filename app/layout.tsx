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
  title: "Parmar Properties",
  description: "South Mumbai's premier real estate consultancy. Curating exceptional homes since 1994.",
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
