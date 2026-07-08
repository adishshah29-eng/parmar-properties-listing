"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PropertyCard from "@/components/common/PropertyCard";
import { SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";

export default function GalleryClient({ 
  projects, cities, developers, currentPage, totalPages, totalCount, initialFilters 
}: { 
  projects: any[], cities: string[], developers: string[], currentPage: number, totalPages: number, totalCount: number, initialFilters: any
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const statuses = ["All", "READY_TO_MOVE", "UNDER_CONSTRUCTION", "NEW_LAUNCH", "SOLD_OUT"];
  const budgetOptions = [
    { label: "Any", value: "" },
    { label: "₹1 Cr", value: "10000000" },
    { label: "₹2 Cr", value: "20000000" },
    { label: "₹5 Cr", value: "50000000" },
    { label: "₹10 Cr", value: "100000000" },
    { label: "₹20 Cr", value: "200000000" },
    { label: "₹50 Cr+", value: "500000000" },
  ];

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/listings?${params.toString()}`);
  };

  const toggleBhk = (bhk: number) => {
    const currentBhk = initialFilters.bhk || [];
    let newBhk;
    if (currentBhk.includes(bhk)) {
      newBhk = currentBhk.filter((b: number) => b !== bhk);
    } else {
      newBhk = [...currentBhk, bhk];
    }
    
    const params = new URLSearchParams(searchParams.toString());
    if (newBhk.length > 0) {
      params.set("bhk", newBhk.join(","));
    } else {
      params.delete("bhk");
    }
    params.set("page", "1");
    router.push(`/listings?${params.toString()}`);
  };

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/listings?${params.toString()}`);
  };

  // Extract the sidebar content to reuse in desktop and mobile drawer
  const FilterSidebar = () => (
    <div className="flex flex-col gap-8">
      {/* City */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Location</h3>
        <select 
          className="w-full text-sm border border-border px-4 py-3 bg-background text-foreground outline-none cursor-pointer hover:border-primary transition-colors appearance-none rounded-lg"
          value={initialFilters.city || "All"}
          onChange={(e) => updateFilters("city", e.target.value)}
        >
          {cities.map(c => <option key={c} value={c}>{c === "All" ? "All Cities" : c}</option>)}
        </select>
      </div>

      {/* Developer */}
      {developers.length > 2 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Developer</h3>
          <select 
            className="w-full text-sm border border-border px-4 py-3 bg-background text-foreground outline-none cursor-pointer hover:border-primary transition-colors appearance-none rounded-lg"
            value={initialFilters.developer || "All"}
            onChange={(e) => updateFilters("developer", e.target.value)}
          >
            {developers.map(d => <option key={d} value={d}>{d === "All" ? "All Developers" : d}</option>)}
          </select>
        </div>
      )}

      {/* Status */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Project Status</h3>
        <div className="flex flex-col gap-2">
          {statuses.map(s => {
            const isSelected = (initialFilters.status || "All") === s;
            return (
              <button 
                key={s} 
                className={`text-left px-4 py-2 text-sm transition-all duration-300 rounded-md ${isSelected ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]' : 'text-foreground hover:bg-muted'}`}
                onClick={() => updateFilters("status", s === "All" ? "" : s)}
              >
                {s === "All" ? "Any Status" : s.replace(/_/g, " ")}
              </button>
            )
          })}
        </div>
      </div>

      {/* BHK Filters */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Bedrooms</h3>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map(bhk => {
            const isSelected = (initialFilters.bhk || []).includes(bhk);
            return (
              <button
                key={bhk}
                onClick={() => toggleBhk(bhk)}
                className={`px-4 py-2 border text-sm transition-all duration-300 rounded-md flex-1 text-center ${isSelected ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-[1.02]' : 'bg-background text-foreground border-border hover:border-primary'}`}
              >
                {bhk === 5 ? '5+' : bhk}
              </button>
            )
          })}
        </div>
      </div>

      {/* Budget Filters */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Budget Range</h3>
        <div className="flex flex-col gap-3">
          <select 
            className="w-full text-sm border border-border px-4 py-3 bg-background text-foreground outline-none cursor-pointer hover:border-primary transition-colors appearance-none rounded-lg"
            value={initialFilters.minPrice || ""}
            onChange={(e) => updateFilters("minPrice", e.target.value)}
          >
            <option value="">Min Price (Any)</option>
            {budgetOptions.filter(o => o.value !== "").map(opt => <option key={`min-${opt.value}`} value={opt.value}>{opt.label}</option>)}
          </select>
          <select 
            className="w-full text-sm border border-border px-4 py-3 bg-background text-foreground outline-none cursor-pointer hover:border-primary transition-colors appearance-none rounded-lg"
            value={initialFilters.maxPrice || ""}
            onChange={(e) => updateFilters("maxPrice", e.target.value)}
          >
            <option value="">Max Price (Any)</option>
            {budgetOptions.filter(o => o.value !== "").map(opt => <option key={`max-${opt.value}`} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* Hero Section */}
      <div className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-zinc-900">
          <Image 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
            alt="Luxury Real Estate"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        
        <div className="relative z-10 text-center px-5 w-full max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-6xl text-white font-medium mb-4 drop-shadow-md"
          >
            Curated Properties
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/90 text-lg md:text-xl font-sans mb-8 drop-shadow-md"
          >
            Discover your next extraordinary home in our exclusive collection.
          </motion.p>
          
          {/* Mobile Filter Button over Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:hidden"
          >
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3 w-full max-w-md mx-auto hover:bg-white/20 transition-colors shadow-lg"
            >
              <SlidersHorizontal size={18} />
              <span className="font-medium text-lg">Filter Properties ({totalCount})</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 pt-12 flex flex-col md:flex-row gap-10">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-[280px] lg:w-[300px] flex-shrink-0">
          <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pb-10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border sticky top-0 bg-background z-10 pt-2">
              <h2 className="font-serif text-2xl font-medium">Filters</h2>
              <span className="text-sm bg-muted text-muted-foreground px-2 py-1 rounded-md">{totalCount} results</span>
            </div>
            <FilterSidebar />
          </div>
        </aside>

        {/* Mobile Filters Drawer */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm md:hidden"
            >
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-[85%] max-w-[400px] bg-background h-full overflow-y-auto flex flex-col shadow-2xl"
              >
                <div className="p-5 flex items-center justify-between border-b border-border sticky top-0 bg-background z-10">
                  <h2 className="font-serif text-xl font-medium">Filters</h2>
                  <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-muted rounded-full">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-5 flex-1">
                  <FilterSidebar />
                </div>
                <div className="p-5 border-t border-border sticky bottom-0 bg-background">
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-medium shadow-md"
                  >
                    Show {totalCount} Properties
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Property Grid */}
        <div className="flex-1 min-w-0">
          <div className="md:hidden flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-medium">Results</h2>
            <span className="text-sm bg-muted text-muted-foreground px-2 py-1 rounded-md">{totalCount} available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 group/grid">
            {projects.length === 0 ? (
              <div className="col-span-full py-20 px-5 text-center border border-dashed border-border rounded-2xl bg-card/50">
                <div className="text-[22px] font-serif font-medium m-0 mb-2 text-foreground">No properties found</div>
                <div className="text-muted-foreground text-sm font-sans max-w-md mx-auto">
                  Try broadening your search criteria or removing some filters to find what you're looking for.
                </div>
                <button 
                  onClick={() => router.push('/listings')}
                  className="mt-6 px-6 py-2 border border-border rounded-lg hover:border-primary transition-colors text-sm font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                  className="transition-opacity duration-500 group-hover/grid:opacity-40 hover:!opacity-100"
                >
                  <PropertyCard 
                    project={project} 
                    onClick={() => router.push(`/projects/${project.slug}`)} 
                  />
                </motion.div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-border/50">
              <button 
                onClick={() => setPage(currentPage - 1)} 
                disabled={currentPage === 1}
                className={`px-6 py-3 font-sans text-sm font-medium rounded-lg transition-all ${currentPage === 1 ? "opacity-30 cursor-not-allowed bg-muted" : "cursor-pointer bg-card hover:bg-muted border border-border"}`}
              >
                Previous
              </button>
              <span className="px-4 py-2 flex items-center justify-center font-sans text-sm font-medium text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setPage(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className={`px-6 py-3 font-sans text-sm font-medium rounded-lg transition-all ${currentPage === totalPages ? "opacity-30 cursor-not-allowed bg-muted" : "cursor-pointer bg-card hover:bg-muted border border-border"}`}
              >
                Next
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
