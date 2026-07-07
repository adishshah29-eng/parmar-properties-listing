import type { Metadata } from "next";
import "./globals.css";
import "./components.css";
import AgentationWrapper from "./AgentationWrapper";
import { DM_Sans, Playfair_Display } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body>
        <Navbar />
        {children}
        <Footer />
        <AgentationWrapper />
      </body>
    </html>
  );
}
