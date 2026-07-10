"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PanInfo, motion } from "framer-motion";

export function NeighborhoodCarousel({ neighborhoods }: { neighborhoods: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % neighborhoods.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + neighborhoods.length) % neighborhoods.length);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  return (
    <div className="w-full relative mt-4 md:mt-8">
      {/* Navigation Overlays (Desktop) */}
      <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-0 md:-mx-6 pointer-events-none z-30">
        <button
          onClick={handlePrev}
          className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 shadow-xl pointer-events-auto"
          aria-label="Previous"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 shadow-xl pointer-events-auto"
          aria-label="Next"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <motion.div 
        className="flex w-full gap-2 md:gap-3 h-[400px] md:h-[480px] overflow-hidden"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        {neighborhoods.map((n, idx) => {
          const isActive = idx === activeIndex;

          return (
            <div
              key={n.name}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-full overflow-hidden rounded-[1.5rem] md:rounded-[2rem] cursor-pointer transition-[flex,box-shadow,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive 
                  ? "flex-[8] md:flex-[6] shadow-2xl z-10" 
                  : "flex-[1.5] md:flex-[1] hover:flex-[1.5] opacity-70 hover:opacity-100 z-0"
              }`}
            >
              <Image
                src={n.image}
                alt={n.name}
                fill
                unoptimized
                className={`object-cover transition-transform duration-[1.5s] ease-out pointer-events-none ${isActive ? "scale-100" : "scale-110"}`}
              />
              
              <div 
                className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                  isActive ? "bg-gradient-to-t from-black/90 via-black/30 to-transparent" : "bg-black/40"
                }`} 
              />

              {/* Inactive Vertical Title */}
              <div 
                className={`absolute inset-0 flex items-end justify-center pb-8 md:pb-12 transition-opacity duration-500 pointer-events-none ${
                  isActive ? "opacity-0" : "opacity-100"
                }`}
              >
                <span className="text-white font-serif text-sm md:text-lg -rotate-90 whitespace-nowrap origin-bottom drop-shadow-md">
                  {n.name}
                </span>
              </div>

              {/* Active Content Overlay */}
              <div 
                className={`absolute bottom-0 left-0 w-full p-6 md:p-10 pointer-events-none flex flex-col justify-end transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="w-[300px] md:w-[400px]">
                  <p className="text-white/70 text-[10px] tracking-[0.3em] uppercase mb-2 font-sans font-medium">
                    Explore Region
                  </p>
                  <h3 className="font-serif text-3xl md:text-5xl text-white font-medium mb-3 drop-shadow-xl tracking-tight leading-tight">
                    {n.name}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base font-sans mb-6 font-light leading-relaxed hidden sm:block">
                    {n.tagline}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pointer-events-auto">
                    <span className="text-[#B59E7E] font-medium text-xs md:text-sm font-sans bg-black/40 backdrop-blur-xl px-4 md:px-5 py-2 rounded-full border border-white/10 shadow-lg whitespace-nowrap">
                      {n.count} properties
                    </span>
                    <Link
                      href="/listings"
                      className="bg-white text-black px-5 md:px-6 py-2 rounded-full font-medium text-xs md:text-sm hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-xl whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Discover Properties
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
