import type { Metadata } from "next";
import "./globals.css";
import "./components.css";
import AgentationWrapper from "./AgentationWrapper";
import { Inter, Fraunces } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parmar Properties",
  description: "Curated boutique property gallery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        {/* Background Mesh */}
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: -1, background: "var(--bg-page)", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", borderRadius: "50%", background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)", opacity: 0.14, filter: "blur(60px)" }} />
          <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "60vw", height: "60vw", borderRadius: "50%", background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)", opacity: 0.12, filter: "blur(80px)" }} />
          <div style={{ position: "absolute", top: "40%", right: "20%", width: "30vw", height: "30vw", borderRadius: "50%", background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)", opacity: 0.08, filter: "blur(50px)" }} />
        </div>

        {children}

        <AgentationWrapper />
      </body>
    </html>
  );
}
