"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/listings", label: "Listings" },
    { href: "/category", label: "Under Development" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/97 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-none group">
          <span className="font-serif text-[17px] font-medium tracking-tight text-foreground">PARMAR</span>
          <span className="text-[8px] tracking-[0.3em] uppercase text-muted-foreground font-sans">Properties · Est. 1994</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-foreground">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={`hover:text-primary transition-colors font-sans ${pathname === href ? "text-primary font-medium" : ""}`}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a href="tel:+919820000000" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 font-sans">
            <Phone size={13} /> +91 98200 00000
          </a>
          <Link
            href="/contact"
            className="bg-primary text-primary-foreground text-sm px-5 py-2 hover:bg-primary/90 transition-colors font-sans font-medium tracking-wide"
          >
            Enquire Now
          </Link>
        </div>

        <button className="md:hidden p-1" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-border px-5 py-5 flex flex-col gap-5 text-sm font-sans">
          <Link href="/" onClick={() => setOpen(false)} className="text-left hover:text-primary transition-colors">Home</Link>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="text-left hover:text-primary transition-colors">
              {label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)} className="bg-primary text-primary-foreground px-4 py-3 font-medium mt-1 text-center">
            Enquire Now
          </Link>
        </div>
      )}
    </header>
  );
}
