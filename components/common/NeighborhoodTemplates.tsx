"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PanInfo, motion, AnimatePresence } from "framer-motion";

// --- Template 1: Expanding Accordion ---
export function Template1({ neighborhoods }: { neighborhoods: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % neighborhoods.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + neighborhoods.length) % neighborhoods.length);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -50) handleNext();
    else if (info.offset.x > 50) handlePrev();
  };

  return (
    <div className="w-full relative mt-4 md:mt-8">
      <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-0 md:-mx-6 pointer-events-none z-30">
        <button onClick={handlePrev} className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 shadow-xl pointer-events-auto">
          <ChevronLeft size={24} />
        </button>
        <button onClick={handleNext} className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 shadow-xl pointer-events-auto">
          <ChevronRight size={24} />
        </button>
      </div>

      <motion.div 
        className="flex w-full gap-2 md:gap-3 h-[400px] md:h-[480px] overflow-hidden"
        drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={handleDragEnd}
      >
        {neighborhoods.map((n, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={n.name}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-full overflow-hidden rounded-[1.5rem] md:rounded-[2rem] cursor-pointer transition-[flex,box-shadow,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? "flex-[8] md:flex-[6] shadow-2xl z-10" : "flex-[1.5] md:flex-[1] hover:flex-[1.5] opacity-70 hover:opacity-100 z-0"}`}
            >
              <Image src={n.image} alt={n.name} fill unoptimized className={`object-cover transition-transform duration-[1.5s] ease-out pointer-events-none ${isActive ? "scale-100" : "scale-110"}`} />
              <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${isActive ? "bg-gradient-to-t from-black/90 via-black/30 to-transparent" : "bg-black/40"}`} />
              <div className={`absolute inset-0 flex items-end justify-center pb-8 md:pb-12 transition-opacity duration-500 pointer-events-none ${isActive ? "opacity-0" : "opacity-100"}`}>
                <span className="text-white font-serif text-sm md:text-lg -rotate-90 whitespace-nowrap origin-bottom drop-shadow-md">{n.name}</span>
              </div>
              <div className={`absolute bottom-0 left-0 w-full p-6 md:p-10 pointer-events-none flex flex-col justify-end transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                <div className="w-[300px] md:w-[400px]">
                  <p className="text-white/70 text-[10px] tracking-[0.3em] uppercase mb-2 font-sans font-medium">Explore Region</p>
                  <h3 className="font-serif text-3xl md:text-5xl text-white font-medium mb-3 drop-shadow-xl tracking-tight leading-tight">{n.name}</h3>
                  <p className="text-white/80 text-sm md:text-base font-sans mb-6 font-light leading-relaxed hidden sm:block">{n.tagline}</p>
                  <div className="flex flex-wrap items-center gap-3 pointer-events-auto">
                    <span className="text-[#B59E7E] font-medium text-xs md:text-sm font-sans bg-black/40 backdrop-blur-xl px-4 md:px-5 py-2 rounded-full border border-white/10 shadow-lg whitespace-nowrap">{n.count} properties</span>
                    <Link href="/listings" className="bg-white text-black px-5 md:px-6 py-2 rounded-full font-medium text-xs md:text-sm hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-xl whitespace-nowrap" onClick={(e) => e.stopPropagation()}>Discover Properties</Link>
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

// --- Template 2: 3D Coverflow ---
export function Template2({ neighborhoods }: { neighborhoods: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % neighborhoods.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + neighborhoods.length) % neighborhoods.length);

  return (
    <div className="w-full relative h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden perspective-[1000px] mt-4 md:mt-8">
      <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 z-40 pointer-events-none">
        <button onClick={handlePrev} className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto transition-all hover:scale-110"><ChevronLeft size={24} /></button>
        <button onClick={handleNext} className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto transition-all hover:scale-110"><ChevronRight size={24} /></button>
      </div>

      {neighborhoods.map((n, idx) => {
        let diff = idx - activeIndex;
        // Wrap around logic for 3D
        if (diff > neighborhoods.length / 2) diff -= neighborhoods.length;
        if (diff < -neighborhoods.length / 2) diff += neighborhoods.length;

        const isActive = diff === 0;
        const isVisible = Math.abs(diff) <= 2;

        return isVisible && (
          <motion.div
            key={n.name}
            className="absolute w-[280px] h-[380px] md:w-[400px] md:h-[500px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl"
            initial={false}
            animate={{
              x: `${diff * 60}%`,
              scale: isActive ? 1 : Math.max(0.6, 1 - Math.abs(diff) * 0.15),
              opacity: isActive ? 1 : Math.max(0, 0.7 - Math.abs(diff) * 0.3),
              zIndex: 30 - Math.abs(diff),
              rotateY: diff * -15, // 3D rotation
            }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            onClick={() => setActiveIndex(idx)}
          >
            <Image src={n.image} alt={n.name} fill unoptimized className="object-cover" />
            <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${isActive ? 'opacity-20' : 'opacity-60'}`} />
            
            {isActive && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent"
              >
                <h3 className="font-serif text-3xl text-white mb-2">{n.name}</h3>
                <span className="text-primary font-sans text-sm tracking-widest uppercase">{n.count} Properties</span>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// --- Template 3: Minimalist Crossfade ---
export function Template3({ neighborhoods }: { neighborhoods: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeNeighborhood = neighborhoods[activeIndex];

  return (
    <div className="w-full relative h-[500px] md:h-[600px] rounded-[2rem] overflow-hidden mt-8 shadow-2xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image src={activeNeighborhood.image} alt={activeNeighborhood.name} fill unoptimized className="object-cover" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12 z-10 pointer-events-none">
        <div className="max-w-xl pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${activeIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-serif text-5xl md:text-7xl text-white mb-4 drop-shadow-xl">{activeNeighborhood.name}</h3>
              <p className="font-sans text-lg md:text-xl text-white/80 font-light mb-6">{activeNeighborhood.tagline}</p>
              <Link href="/listings" className="inline-block bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-white/90 transition-colors shadow-xl">Explore Area</Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Minimalist Dock */}
        <div className="self-center bg-black/30 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex gap-2 pointer-events-auto">
          {neighborhoods.map((n, idx) => (
            <button
              key={n.name}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden transition-all duration-300 ${idx === activeIndex ? 'ring-2 ring-white scale-110 z-10' : 'opacity-50 hover:opacity-100'}`}
            >
              <Image src={n.image} alt={n.name} fill unoptimized className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Template 4: Parallax Glide ---
export function Template4({ neighborhoods }: { neighborhoods: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % neighborhoods.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + neighborhoods.length) % neighborhoods.length);

  return (
    <div className="w-full relative mt-8">
      <div className="flex justify-between items-end mb-6 px-2">
        <div>
          <h2 className="text-3xl font-serif text-white">Explore Regions</h2>
          <p className="text-white/60 font-sans mt-1">Scroll to discover</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrev} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"><ChevronLeft size={20} /></button>
          <button onClick={handleNext} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="relative overflow-hidden w-full h-[400px] md:h-[500px] rounded-3xl">
        <motion.div 
          className="flex h-full"
          animate={{ x: `-${activeIndex * 100}%` }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.9 }}
        >
          {neighborhoods.map((n, idx) => (
            <div key={n.name} className="w-full h-full flex-shrink-0 relative group overflow-hidden">
              <motion.div
                className="absolute inset-0"
                animate={{ x: `${(idx - activeIndex) * 20}%` }} // Parallax effect
                transition={{ type: "spring", bounce: 0.2, duration: 0.9 }}
              >
                <Image src={n.image} alt={n.name} fill unoptimized className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-12 left-12 max-w-sm">
                <h3 className="font-serif text-4xl md:text-6xl text-white mb-2">{n.name}</h3>
                <p className="font-sans text-white/80 mb-6">{n.tagline}</p>
                <Link href="/listings" className="text-white border-b border-white/30 pb-1 hover:border-white transition-colors uppercase tracking-widest text-xs font-medium">View Properties</Link>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// --- Template 5: Spring-Loaded Stack ---
export function Template5({ neighborhoods }: { neighborhoods: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleNext = () => setActiveIndex((prev) => (prev + 1) % neighborhoods.length);

  return (
    <div className="w-full relative h-[550px] flex items-center justify-center mt-8">
      {neighborhoods.map((n, idx) => {
        let diff = idx - activeIndex;
        if (diff < 0) diff += neighborhoods.length; // Ensure diff is always positive for stack order
        
        const isVisible = diff < 4;
        if (!isVisible) return null;

        return (
          <motion.div
            key={n.name}
            className="absolute w-[300px] h-[400px] md:w-[450px] md:h-[550px] rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
            initial={false}
            animate={{
              y: diff * 20,
              scale: 1 - diff * 0.05,
              opacity: 1 - diff * 0.2,
              zIndex: 10 - diff,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={diff === 0 ? handleNext : () => setActiveIndex(idx)}
          >
            <Image src={n.image} alt={n.name} fill unoptimized className="object-cover" />
            <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${diff === 0 ? 'opacity-30' : 'opacity-60'}`} />
            
            <div className="absolute bottom-0 w-full p-8 bg-gradient-to-t from-black/90 to-transparent">
              <p className="text-white/60 text-xs tracking-widest uppercase mb-1">{n.count} Properties</p>
              <h3 className="font-serif text-3xl md:text-4xl text-white mb-2">{n.name}</h3>
              {diff === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                  <span className="inline-block px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm hover:bg-white/30 transition-colors">Click to reveal next</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
