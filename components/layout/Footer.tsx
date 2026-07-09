import Link from "next/link";
import { Phone, MessageCircle, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-foreground text-background overflow-hidden border-t border-white/10">
      {/* Giant Typographic Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-serif font-bold text-background/[0.03] select-none pointer-events-none tracking-tighter whitespace-nowrap z-0">
        PARMAR
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-20">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <div className="font-serif text-2xl font-medium tracking-tight mb-1">PARMAR</div>
            <div className="text-[9px] tracking-[0.35em] uppercase text-background/50 mb-5 font-sans">Properties · Est. 1994</div>
            <p className="text-background/60 text-sm leading-relaxed pr-4">South Mumbai's premier real estate consultancy. Curating exceptional homes since 1994.</p>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-background/40 mb-6 font-sans font-semibold">Browse</h4>
            <ul className="space-y-3.5 text-sm text-background/70">
              {["Under Development", "Ready to Move", "Resale", "Luxury Homes", "Commercial"].map((item) => (
                <li key={item}>
                  <Link href="/listings" className="inline-block hover:text-white transition-all duration-300 hover:translate-x-1.5">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-background/40 mb-6 font-sans font-semibold">Localities</h4>
            <ul className="space-y-3.5 text-sm text-background/70">
              {["Worli", "Malabar Hill", "Cuffe Parade", "Breach Candy", "Tardeo", "Walkeshwar"].map((item) => (
                <li key={item}>
                  <Link href="/listings" className="inline-block hover:text-white transition-all duration-300 hover:translate-x-1.5">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-background/40 mb-6 font-sans font-semibold">Contact</h4>
            <ul className="space-y-4 text-sm text-background/70">
              <li className="flex items-center gap-3 group cursor-pointer"><Phone size={14} className="shrink-0 text-primary group-hover:scale-110 transition-transform" /> <span className="group-hover:text-white transition-colors">+91 98200 00000</span></li>
              <li className="flex items-center gap-3 group cursor-pointer"><MessageCircle size={14} className="shrink-0 text-primary group-hover:scale-110 transition-transform" /> <span className="group-hover:text-white transition-colors">WhatsApp us anytime</span></li>
              <li className="flex items-center gap-3 group cursor-pointer"><Mail size={14} className="shrink-0 text-primary group-hover:scale-110 transition-transform" /> <span className="group-hover:text-white transition-colors">hello@parmarproperties.in</span></li>
              <li className="text-background/40 text-xs leading-relaxed mt-4 pt-4 border-t border-white/5">Ground Floor, Maker Bhavan No. 1<br />Sir V. T. Marg, New Marine Lines<br />Mumbai 400 020</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10 mt-16 pt-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between text-xs text-background/40 font-sans">
          <p>© 2025 Parmar Properties Pvt Ltd. All rights reserved. MahaRERA Reg: A51800004579</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms", "Disclaimer"].map((l) => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
