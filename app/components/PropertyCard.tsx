"use client";

import { useState } from "react";
import { Heart, MapPin, Bed } from "lucide-react";
import Image from "next/image";

const STATUS_COLOR: Record<string, string> = {
  "UNDER_CONSTRUCTION": "bg-emerald-900 text-emerald-100",
  "NEW_LAUNCH": "bg-emerald-900 text-emerald-100",
  "READY_TO_MOVE": "bg-sky-800 text-sky-50",
  "RESALE": "bg-amber-800 text-amber-50",
  "SOLD_OUT": "bg-[#1A1A18] text-[#B59E7E]",
};

export function StatusBadge({ status }: { status: string }) {
  const displayStatus = status.replace(/_/g, " ");
  const colorClass = STATUS_COLOR[status] || "bg-primary text-primary-foreground";
  return (
    <span className={`inline-block px-2.5 py-[3px] text-[10px] tracking-widest uppercase font-sans font-semibold ${colorClass}`}>
      {displayStatus}
    </span>
  );
}

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

export default function PropertyCard({ project, onClick }: { project: any; onClick?: () => void }) {
  const [saved, setSaved] = useState(false);
  
  let projectImage = project.images?.length > 0 ? project.images[0].url : "";
  if (projectImage && !projectImage.startsWith('/') && !projectImage.startsWith('http')) {
    projectImage = '/' + projectImage;
  }

  let minPrice = Infinity;
  let maxPrice = -Infinity;
  let bhkText = "";
  let areaText = "";

  if (project.configurations && project.configurations.length > 0) {
    const minBhk = Math.min(...project.configurations.map((c: any) => c.bhk));
    const maxBhk = Math.max(...project.configurations.map((c: any) => c.bhk));
    bhkText = minBhk === maxBhk ? `${minBhk}` : `${minBhk}-${maxBhk}`;
    
    const minArea = Math.min(...project.configurations.map((c: any) => c.carpetArea));
    const maxArea = Math.max(...project.configurations.map((c: any) => c.carpetArea));
    areaText = minArea === maxArea ? `${minArea} sq ft` : `${minArea}-${maxArea} sq ft`;

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
    <div className="bg-card group cursor-pointer overflow-hidden border border-border hover:border-primary/40 transition-colors duration-300" onClick={onClick}>
      <div className="relative overflow-hidden h-56 bg-muted">
        {projectImage ? (
          <Image src={projectImage} alt={project.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3"><StatusBadge status={project.derivedStatus} /></div>
        <button
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 flex items-center justify-center hover:bg-white transition-colors z-10"
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); setSaved(!saved); }}
        >
          <Heart size={14} fill={saved ? "currentColor" : "none"} className={saved ? "text-red-500" : "text-foreground"} />
        </button>
        <div className="absolute bottom-3 left-3 z-10">
          <span className="text-white font-serif text-xl font-medium drop-shadow">{priceText}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-base font-medium text-foreground leading-snug">{project.name}</h3>
        <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
          <MapPin size={11} />
          <span>{project.location}, {project.city}</span>
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
          {bhkText && <span className="flex items-center gap-1"><Bed size={11} />{bhkText} BHK</span>}
          {areaText && <span>{areaText}</span>}
          <span className="ml-auto text-primary text-[11px] font-medium font-sans">{project.developer?.name}</span>
        </div>
      </div>
    </div>
  );
}
