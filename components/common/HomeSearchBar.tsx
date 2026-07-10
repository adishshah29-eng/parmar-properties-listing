"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building2, IndianRupee } from "lucide-react";

interface HomeSearchBarProps {
  locations: string[];
}

export function HomeSearchBar({ locations }: HomeSearchBarProps) {
  const router = useRouter();
  const [location, setLocation] = useState("All");
  const [bhk, setBhk] = useState("All");
  const [price, setPrice] = useState("All");

  const configurations = ["All", "1", "2", "3", "4", "5"];
  const priceRanges = [
    { label: "All", value: "All" },
    { label: "Under ₹1 Cr", value: "0-10000000" },
    { label: "₹1 Cr - ₹3 Cr", value: "10000000-30000000" },
    { label: "₹3 Cr - ₹5 Cr", value: "30000000-50000000" },
    { label: "₹5 Cr - ₹10 Cr", value: "50000000-100000000" },
    { label: "Above ₹10 Cr", value: "100000000-9999999999" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (location !== "All") params.set("location", location);
    if (bhk !== "All") params.set("bhk", bhk);
    if (price !== "All") {
      const [min, max] = price.split("-");
      if (min && min !== "0") params.set("minPrice", min);
      if (max && max !== "9999999999") params.set("maxPrice", max);
    }
    
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div className="w-full relative z-20 py-8">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <form 
          onSubmit={handleSearch} 
          className="flex flex-col md:flex-row gap-4 items-end bg-card/80 backdrop-blur-xl p-4 md:p-6 rounded-3xl border border-border/50 shadow-2xl"
        >
          
          <div className="flex-1 w-full relative">
            <label className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground mb-2.5 block font-sans font-semibold ml-2">Location</label>
            <div className="relative group">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/60 group-hover:text-primary transition-colors pointer-events-none" size={18} />
              <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-14 pr-4 bg-background/50 border border-border/60 rounded-2xl text-sm font-medium appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer hover:bg-background/80"
                style={{ paddingLeft: "3.5rem" }}
              >
                {locations.map((c) => (
                  <option key={c} value={c}>{c === "All" ? "Any Location" : c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <label className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground mb-2.5 block font-sans font-semibold ml-2">Configuration</label>
            <div className="relative group">
              <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/60 group-hover:text-primary transition-colors pointer-events-none" size={18} />
              <select 
                value={bhk}
                onChange={(e) => setBhk(e.target.value)}
                className="w-full h-14 pr-4 bg-background/50 border border-border/60 rounded-2xl text-sm font-medium appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer hover:bg-background/80"
                style={{ paddingLeft: "3.5rem" }}
              >
                {configurations.map((c) => (
                  <option key={c} value={c}>{c === "All" ? "Any Configuration" : c === "5" ? "5+ BHK" : `${c} BHK`}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <label className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground mb-2.5 block font-sans font-semibold ml-2">Price Range</label>
            <div className="relative group">
              <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/60 group-hover:text-primary transition-colors pointer-events-none" size={18} />
              <select 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-14 pr-4 bg-background/50 border border-border/60 rounded-2xl text-sm font-medium appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer hover:bg-background/80"
                style={{ paddingLeft: "3.5rem" }}
              >
                {priceRanges.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full md:w-auto h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shrink-0 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Search size={18} />
            <span>Search</span>
          </button>

        </form>
      </div>
    </div>
  );
}
