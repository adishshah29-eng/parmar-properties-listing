"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building2, Activity } from "lucide-react";

interface HomeSearchBarProps {
  cities: string[];
  developers: string[];
}

export function HomeSearchBar({ cities, developers }: HomeSearchBarProps) {
  const router = useRouter();
  const [city, setCity] = useState("All");
  const [developer, setDeveloper] = useState("All");
  const [status, setStatus] = useState("All");

  const statuses = ["All", "Available", "Booked", "On Hold", "Sold Out"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (city !== "All") params.set("city", city);
    if (developer !== "All") params.set("developer", developer);
    if (status !== "All") params.set("status", status);
    
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
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-14 pr-4 bg-background/50 border border-border/60 rounded-2xl text-sm font-medium appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer hover:bg-background/80"
                style={{ paddingLeft: "3.5rem" }}
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c === "All" ? "Any Location" : c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <label className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground mb-2.5 block font-sans font-semibold ml-2">Developer</label>
            <div className="relative group">
              <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/60 group-hover:text-primary transition-colors pointer-events-none" size={18} />
              <select 
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                className="w-full h-14 pr-4 bg-background/50 border border-border/60 rounded-2xl text-sm font-medium appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer hover:bg-background/80"
                style={{ paddingLeft: "3.5rem" }}
              >
                {developers.map((d) => (
                  <option key={d} value={d}>{d === "All" ? "Any Developer" : d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <label className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground mb-2.5 block font-sans font-semibold ml-2">Status</label>
            <div className="relative group">
              <Activity className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/60 group-hover:text-primary transition-colors pointer-events-none" size={18} />
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-14 pr-4 bg-background/50 border border-border/60 rounded-2xl text-sm font-medium appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer hover:bg-background/80"
                style={{ paddingLeft: "3.5rem" }}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s === "All" ? "Any Status" : s}</option>
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
