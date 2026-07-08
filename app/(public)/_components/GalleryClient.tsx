"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
import PropertyCard from "@/components/common/PropertyCard";
import { SlidersHorizontal, Map as MapIcon, Grid as GridIcon } from "lucide-react";

const LeafletMap = dynamic(() => import('@/components/common/LeafletMap'), { ssr: false });

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
    router.push(`/listings?${params.toString()}`);
  };

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    if (view === "map") params.set("view", "map");
    router.push(`/listings?${params.toString()}`);
  };

  const handleViewChange = (newView: "gallery" | "map") => {
    setView(newView);
    const params = new URLSearchParams(searchParams.toString());
    if (newView === "map") params.set("view", "map");
    else params.delete("view");
    router.push(`/listings?${params.toString()}`);
  };

  const renderProjectGrid = (isSplit = false) => (
    <>
      <div className={`grid gap-4 ${isSplit ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
        {projects.length === 0 ? (
          <div className="col-span-full py-16 px-5 text-center border border-border bg-card">
            <div className="text-[22px] font-serif font-medium m-0 mb-2 text-foreground">No properties found</div>
            <div className="text-muted-foreground text-sm font-sans">Try adjusting your search filters to find what you're looking for.</div>
          </div>
        ) : (
          projects.map((project) => (
            <PropertyCard 
              key={project.id} 
              project={project} 
              onClick={() => router.push(`/projects/${project.slug}`)} 
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8 pb-8">
          <button 
            onClick={() => setPage(currentPage - 1)} 
            disabled={currentPage === 1}
            className={`border border-border px-6 py-3 font-sans text-sm hover:border-primary transition-all ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer bg-card text-foreground"}`}
          >
            Previous
          </button>
          <span className="px-4 py-2 flex items-center justify-center font-sans text-sm font-medium">Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setPage(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className={`border border-border px-6 py-3 font-sans text-sm hover:border-primary transition-all ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer bg-card text-foreground"}`}
          >
            Next
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl text-foreground font-medium">All Properties</h1>
            <span className="text-sm text-muted-foreground font-sans bg-muted px-2 py-1">{totalCount} available</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex border border-border bg-card">
              <button onClick={() => handleViewChange("gallery")} className={`p-2 transition-colors flex items-center gap-2 px-4 text-sm font-sans ${view === "gallery" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                <GridIcon size={14} /> Gallery
              </button>
              <button onClick={() => handleViewChange("map")} className={`p-2 transition-colors flex items-center gap-2 px-4 text-sm font-sans ${view === "map" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                <MapIcon size={14} /> Map
              </button>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="bg-background/95 backdrop-blur-sm sticky z-40 pb-4 border-b border-border mb-8 transition-all duration-300 top-16"
        style={{ 
          transform: scrollVisible ? "translateY(0)" : "translateY(-100%)",
          opacity: scrollVisible ? 1 : 0,
          pointerEvents: scrollVisible ? "auto" : "none"
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-wrap gap-3 items-center">
            <select 
              className="text-sm border border-border px-4 py-2 bg-background text-foreground outline-none cursor-pointer hover:border-primary transition-colors font-sans h-10 appearance-none pr-8"
              value={initialFilters.city}
              onChange={(e) => updateFilters("city", e.target.value)}
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '12px' }}
            >
              {cities.map(c => <option key={c} value={c}>{c === "All" ? "All Cities" : c}</option>)}
            </select>

            {developers.length > 2 && (
              <select 
                className="text-sm border border-border px-4 py-2 bg-background text-foreground outline-none cursor-pointer hover:border-primary transition-colors font-sans h-10 appearance-none pr-8"
                value={initialFilters.developer}
                onChange={(e) => updateFilters("developer", e.target.value)}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '12px' }}
              >
                {developers.map(d => <option key={d} value={d}>{d === "All" ? "All Developers" : d}</option>)}
              </select>
            )}

            <div className="flex gap-2 overflow-x-auto no-scrollbar items-center">
              {statuses.map(s => (
                <button 
                  key={s} 
                  className={`px-4 text-xs font-sans border transition-colors h-10 whitespace-nowrap ${initialFilters.status === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:border-primary bg-card'}`}
                  onClick={() => updateFilters("status", s)}
                >
                  {s === "All" ? "All Statuses" : s.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 pb-16">
        <AnimatePresence mode="wait">
          {view === "map" ? (
            <motion.div 
              key="map-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col md:flex-row h-[calc(100vh-280px)] border-t border-border"
            >
              <div className="w-full md:w-1/2 overflow-y-auto pr-0 md:pr-4 py-6">
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
            >
              {renderProjectGrid()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
