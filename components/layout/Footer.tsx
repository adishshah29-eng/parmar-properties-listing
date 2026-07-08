import Link from "next/link";
import { Phone, MessageCircle, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="font-serif text-xl font-medium tracking-tight mb-0.5">PARMAR</div>
            <div className="text-[8px] tracking-[0.3em] uppercase text-background/40 mb-4 font-sans">Properties · Est. 1994</div>
            <p className="text-background/55 text-sm leading-relaxed">South Mumbai's premier real estate consultancy. Curating exceptional homes since 1994.</p>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-background/35 mb-4 font-sans">Browse</h4>
            <ul className="space-y-2.5 text-sm text-background/65">
              {["Under Development", "Ready to Move", "Resale", "Luxury Homes", "Commercial"].map((item) => (
                <li key={item}><Link href="/listings" className="hover:text-background transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-background/35 mb-4 font-sans">Localities</h4>
            <ul className="space-y-2.5 text-sm text-background/65">
              {["Worli", "Malabar Hill", "Cuffe Parade", "Breach Candy", "Tardeo", "Walkeshwar"].map((item) => (
                <li key={item}><Link href="/listings" className="hover:text-background transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-background/35 mb-4 font-sans">Contact</h4>
            <ul className="space-y-3 text-sm text-background/65">
              <li className="flex items-center gap-2.5"><Phone size={13} className="shrink-0" /> +91 98200 00000</li>
              <li className="flex items-center gap-2.5"><MessageCircle size={13} className="shrink-0" /> WhatsApp us anytime</li>
              <li className="flex items-center gap-2.5"><Mail size={13} className="shrink-0" /> hello@parmarproperties.in</li>
              <li className="text-background/40 text-xs leading-relaxed mt-2">Ground Floor, Maker Bhavan No. 1<br />Sir V. T. Marg, New Marine Lines<br />Mumbai 400 020</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10 mt-12 pt-6 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between text-xs text-background/35 font-sans">
          <p>© 2025 Parmar Properties Pvt Ltd. All rights reserved. MahaRERA Reg: A51800004579</p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms", "Disclaimer"].map((l) => <a key={l} href="#" className="hover:text-background/60 transition-colors">{l}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
