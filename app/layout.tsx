import type { Metadata } from "next";
import "./globals.css";
import "./components.css";
import Link from "next/link";
import AgentationWrapper from "./AgentationWrapper";
import { createClient } from "@/lib/supabase/server";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Parmar Properties",
  description: "Curated boutique property gallery",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('site_settings').select('*').limit(1).single();
  const waNumber = settings?.whatsappNumber || "919876543210";
  const contactUrl = buildWhatsAppLink(waNumber, "Parmar Properties");

  return (
    <html lang="en">
      <body>
        <header className="main">
          <div className="wrap">
            <Link href="/" className="logo">
              <svg viewBox="0 0 32 32" fill="none" style={{ width: "32px", height: "32px" }}>
                <path d="M16 2L2 12V30H30V12L16 2Z" fill="var(--accent)" />
                <path d="M16 8L8 14V26H24V14L16 8Z" fill="#FFFFFF" />
              </svg>
              Parmar<span>Properties</span>
            </Link>
            
            <nav className="header-nav">
              <Link href="/">Explore</Link>
              <Link href="/?view=map">Map View</Link>
            </nav>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Link href="/admin" style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>Admin</Link>
              <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="header-contact-link">
                Enquire
              </a>
            </div>
          </div>
        </header>

        {children}
        
        <footer className="main">
          <div className="wrap">
            <div className="footer-grid">
              <div className="footer-col">
                <h4>Parmar Properties</h4>
                <a href="/">Explore Properties</a>
                <a href="/?view=map">Map View</a>
              </div>
              <div className="footer-col">
                <h4>Contact</h4>
                <a href={contactUrl} target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "24px", color: "var(--text-muted)", fontSize: "14px", display: "flex", justifyContent: "space-between" }}>
              <div>© 2026 Parmar Properties. All rights reserved.</div>
            </div>
          </div>
        </footer>

        <AgentationWrapper />
      </body>
    </html>
  );
}
