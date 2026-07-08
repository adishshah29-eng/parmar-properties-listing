import React from "react";
import Link from "next/link";

export default function Header({ contactUrl }: { contactUrl: string }) {
  return (
    <header className="main glass-strong sticky top-0 z-50">
      <div className="wrap flex justify-between items-center py-4">
        <Link href="/" className="logo flex items-center gap-2 font-fraunces text-xl font-medium text-[var(--text-dark)] no-underline">
          <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
            <path d="M16 2L2 12V30H30V12L16 2Z" fill="var(--accent)" />
            <path d="M16 8L8 14V26H24V14L16 8Z" fill="#FFFFFF" />
          </svg>
          Parmar <span className="text-[var(--text-muted)]">Properties</span>
        </Link>
        
        <nav className="header-nav hidden md:flex items-center gap-6">
          <Link href="/" className="no-underline text-[var(--text-dark)] font-medium text-[15px]">Explore</Link>
          <Link href="/?view=map" className="no-underline text-[var(--text-dark)] font-medium text-[15px]">Map View</Link>
        </nav>

        <div className="flex gap-4 items-center">
          <Link href="/admin" className="text-[var(--text-muted)] text-sm font-medium no-underline">Admin</Link>
          <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="glass-chip px-4 py-2 text-sm font-semibold text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors no-underline">
            Enquire
          </a>
        </div>
      </div>
    </header>
  );
}
