import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import Header from "./Header";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('site_settings').select('*').limit(1).single();
  const waNumber = settings?.whatsappNumber || "919876543210";
  const contactUrl = buildWhatsAppLink(waNumber, "Parmar Properties");

  return (
    <>
      <Header contactUrl={contactUrl} />

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
    </>
  );
}
