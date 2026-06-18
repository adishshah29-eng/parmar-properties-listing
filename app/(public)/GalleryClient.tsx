"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('../components/LeafletMap'), { ssr: false });

function formatInr(value: number) {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function GalleryClient({ 
  projects, cities, developers, currentPage, totalPages, totalCount, initialFilters 
}: { 
  projects: any[], cities: string[], developers: string[], currentPage: number, totalPages: number, totalCount: number, initialFilters: any
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialView = searchParams.get("view") === "map" ? "map" : "gallery";
  const [view, setView] = useState<"gallery" | "map">(initialView);

  const statuses = ["All", "READY_TO_MOVE", "UNDER_CONSTRUCTION", "NEW_LAUNCH", "SOLD_OUT"];

  const [scrollVisible, setScrollVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > 50 && currentScrollY > lastScrollY) {
            setScrollVisible(false);
          } else {
            setScrollVisible(true);
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.set("page", "1");
    if (view === "map") params.set("view", "map");
    router.push(`/?${params.toString()}`);
  };

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    if (view === "map") params.set("view", "map");
    router.push(`/?${params.toString()}`);
  };

  const handleViewChange = (newView: "gallery" | "map") => {
    setView(newView);
    const params = new URLSearchParams(searchParams.toString());
    if (newView === "map") params.set("view", "map");
    else params.delete("view");
    router.push(`/?${params.toString()}`);
  };

  const renderProjectGrid = (isSplit = false) => (
    <>
      <motion.div layout className="gallery-grid" style={{ gridTemplateColumns: isSplit ? "repeat(auto-fill, minmax(280px, 1fr))" : undefined }}>
        <AnimatePresence mode="popLayout">
          {projects.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="col-span-full py-16 px-5 text-center rounded-3xl glass"
            >
              <div className="text-[22px] font-fraunces font-medium m-0 mb-2 text-[var(--text-dark)]">No properties found</div>
              <div className="text-[var(--text-muted)] text-base">Try adjusting your search filters to find what you're looking for.</div>
            </motion.div>
          ) : (
          projects.map((project) => {
            let projectImage = project.images?.length > 0 ? project.images[0].url : "";
            if (projectImage && !projectImage.startsWith('/') && !projectImage.startsWith('http')) {
              projectImage = '/' + projectImage;
            }
            
            let minPrice = Infinity;
            let maxPrice = -Infinity;
            if (project.configurations) {
              project.configurations.forEach((cfg: any) => {
                const price = cfg.carpetArea * cfg.pricePerSqft;
                if (price < minPrice) minPrice = price;
                if (price > maxPrice) maxPrice = price;
              });
            }
 
            let priceText = "Price on request";
            if (minPrice !== Infinity && maxPrice !== -Infinity) {
              if (minPrice === maxPrice) {
                priceText = formatInr(minPrice);
              } else {
                priceText = `${formatInr(minPrice)} – ${formatInr(maxPrice)}`;
              }
            }

            return (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id}
              >
                <Link href={`/projects/${project.slug}`} className="project-card">
                  <div className="pc-image">
                    <div className="glass-chip absolute top-4 left-4 z-10 px-3 py-1.5 text-[11px] font-semibold tracking-wide">
                      {project.derivedStatus.replace(/_/g, " ")}
                    </div>
                    {projectImage ? (
                      <Image src={projectImage} alt={project.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M9 12h.01M15 12h.01M9 9h.01M15 9h.01"/></svg>
                    )}
                    <div className="glass-chip absolute bottom-4 left-4 z-10 px-3 py-1.5 flex flex-col bg-[var(--glass-bg-strong)] text-[var(--text-dark)]">
                      <span className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Starting at</span>
                      <span className="font-fraunces text-base font-semibold text-[var(--accent)]">{priceText}</span>
                    </div>
                  </div>
                  <div className="pc-body">
                    <div className="pc-dev">{project.developer.name}</div>
                    <div className="pc-title font-fraunces">{project.name}</div>
                    <div className="pc-location">{project.location}, {project.city}</div>
                  </div>
                </Link>
              </motion.div>
            );
          })
        )}
        </AnimatePresence>
      </motion.div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8 pb-8">
          <button 
            onClick={() => setPage(currentPage - 1)} 
            disabled={currentPage === 1}
            className={`glass px-6 py-3 rounded-full font-semibold text-[var(--text-dark)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            Previous
          </button>
          <span className="glass-chip px-4 py-2 flex items-center justify-center font-semibold text-sm">Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setPage(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className={`glass px-6 py-3 rounded-full font-semibold text-[var(--text-dark)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            Next
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="body-area p-0">
      <div 
        className="glass-strong sticky z-40 pb-2 border-b border-[var(--border-light)] mb-8 transition-all duration-300 top-0 md:top-[72px]"
        style={{ 
          transform: scrollVisible ? "translateY(0)" : "translateY(-100%)",
          opacity: scrollVisible ? 1 : 0,
          pointerEvents: scrollVisible ? "auto" : "none"
        }}
      >
        <div className="wrap pt-3 pb-1">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <h1 className="font-fraunces text-2xl text-[var(--text-dark)] m-0">Find Your Property</h1>
              <span className="glass-chip px-2.5 py-0.5 text-xs font-semibold text-[var(--text-dark)]">{totalCount} available</span>
            </div>
            
            <div className="flex glass p-0.5 rounded-full border border-[var(--border-light)]">
              <button onClick={() => handleViewChange("gallery")} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${view === "gallery" ? "bg-white text-[var(--text-dark)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-dark)]"}`}>
                Gallery
              </button>
              <button onClick={() => handleViewChange("map")} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${view === "map" ? "bg-white text-[var(--text-dark)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-dark)]"}`}>
                Map View
              </button>
            </div>
          </div>

          <div className="collection-filters flex flex-wrap gap-3 pb-1">
            <select 
              className="chip-select bg-[var(--glass-bg-strong)] backdrop-blur-md border border-[var(--glass-border-accent)] rounded-full px-4 py-2 text-[13px] font-medium text-[var(--text-dark)] outline-none h-[36px] cursor-pointer appearance-none pr-8"
              value={initialFilters.city}
              onChange={(e) => updateFilters("city", e.target.value)}
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '12px' }}
            >
              {cities.map(c => <option key={c} value={c}>{c === "All" ? "All Cities" : c}</option>)}
            </select>

            {developers.length > 2 && (
              <select 
                className="chip-select bg-[var(--glass-bg-strong)] backdrop-blur-md border border-[var(--glass-border-accent)] rounded-full px-4 py-2 text-[13px] font-medium text-[var(--text-dark)] outline-none h-[36px] cursor-pointer appearance-none pr-8"
                value={initialFilters.developer}
                onChange={(e) => updateFilters("developer", e.target.value)}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '12px' }}
              >
                {developers.map(d => <option key={d} value={d}>{d === "All" ? "All Developers" : d}</option>)}
              </select>
            )}

            <div className="collection-chips flex gap-2 overflow-x-auto no-scrollbar items-center">
              {statuses.map(s => (
                <button 
                  key={s} 
                  className={`chip h-[36px] px-4 text-[13px] !py-[6px] ${initialFilters.status === s ? 'active' : ''}`}
                  onClick={() => updateFilters("status", s)}
                >
                  {s === "All" ? "All Statuses" : s.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === "map" ? (
          <motion.div 
            key="map-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col md:flex-row h-[calc(100vh-280px)] border-t border-[var(--border-light)]"
          >
            <div className="w-full md:w-1/2 overflow-y-auto p-6 glass">
              {renderProjectGrid(true)}
            </div>
            <div className="w-full md:w-1/2 relative min-h-[400px]">
              <LeafletMap projects={projects} />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="gallery-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="wrap"
          >
            {renderProjectGrid()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
