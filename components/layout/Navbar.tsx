"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  
  // Only hide navbar in the hero section of the home page
  const isHome = pathname === "/";
  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setIsPastHero(true);
      return;
    }

    const updateNavbarVisibility = () => {
      // 300vh is the height of the hero section
      const heroHeight = window.innerHeight * 3;
      setIsPastHero(window.scrollY > heroHeight - 100);
    };

    window.addEventListener("scroll", updateNavbarVisibility);
    updateNavbarVisibility();

    return () => window.removeEventListener("scroll", updateNavbarVisibility);
  }, [isHome]);

  const navLinks = [
    { href: "/listings", label: "Listings" },
    { href: "/category", label: "Under Development" },
    { href: "/contact", label: "Contact" }
  ];

  if (isHome && !isPastHero) {
    return null; // Return nothing when in the hero section
  }

  return (
    <motion.header 
      initial={isHome ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-none group">
          <span className="font-serif text-[17px] font-medium tracking-tight text-foreground transition-transform group-hover:scale-105 origin-left duration-300">PARMAR</span>
          <span className="text-[8px] tracking-[0.3em] uppercase text-muted-foreground font-sans mt-0.5">Properties · Est. 1994</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2 text-sm text-foreground">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link 
                key={href} 
                href={href} 
                className={`relative px-4 py-2 transition-colors duration-300 font-sans rounded-full ${isActive ? "text-primary font-medium" : "text-foreground/70 hover:text-foreground hover:bg-muted/50"}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-primary/5 border border-primary/10 rounded-full -z-10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {label}
              </Link>
            );
          })}
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
    </motion.header>
  );
}
