"use client";

import React, { useState } from "react";
import Image from "next/image";

import { motion, AnimatePresence } from "framer-motion";

export default function ImageGalleryClient({ images }: { images: any[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const getSafeUrl = (url: string | undefined | null) => {
    if (!url) return '/';
    try {
      if (url.startsWith('http')) return url;
      return url.startsWith('/') ? url : '/' + url;
    } catch (e) {
      return '/';
    }
  };

  const renderGrid = () => {
    if (images.length === 1) {
      return (
        <div 
          className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden cursor-pointer group border border-border/40 shadow-sm"
          onClick={() => setLightboxIndex(0)}
        >
          <Image 
            src={getSafeUrl(images[0].url)} 
            alt={images[0].label || "Property image"} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        </div>
      );
    }

    if (images.length === 2) {
      return (
        <div className="flex gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
          {images.slice(0, 2).map((img, i) => (
            <div key={img.id || i} className="relative flex-1 cursor-pointer group border border-border/40 shadow-sm rounded-2xl overflow-hidden" onClick={() => setLightboxIndex(i)}>
              <Image src={getSafeUrl(img.url)} alt={img.label || `Image ${i+1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          ))}
        </div>
      );
    }

    // 3 or more images: 1 large on left, up to 4 small on right
    const rightImages = images.slice(1, 5);
    const hasMore = images.length > 5;

    return (
      <div className="flex flex-col md:flex-row gap-2 h-[400px] md:h-[500px]">
        {/* Left: Hero Image */}
        <div className="relative flex-1 cursor-pointer group h-full rounded-l-2xl overflow-hidden" onClick={() => setLightboxIndex(0)}>
          <Image 
            src={getSafeUrl(images[0].url)} 
            alt={images[0].label || "Main property image"} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        </div>
        
        {/* Right: Grid of up to 4 images */}
        <div className="hidden md:grid w-[40%] grid-cols-2 grid-rows-2 gap-2 h-full">
          {rightImages.map((img, i) => {
            const isLastVisible = i === 3 || (i === rightImages.length - 1 && !hasMore);
            const showButton = isLastVisible && images.length > 1;
            
            // Calculate which corner needs rounding based on index in 2x2 grid
            let roundedClass = "";
            if (i === 1) roundedClass = "rounded-tr-2xl"; // top-right
            if (i === 3) roundedClass = "rounded-br-2xl"; // bottom-right

            return (
              <div key={img.id || i} className={`relative cursor-pointer group overflow-hidden ${roundedClass}`} onClick={() => setLightboxIndex(i + 1)}>
                <Image 
                  src={getSafeUrl(img.url)} 
                  alt={img.label || `Image ${i+2}`} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                
                {showButton && (
                  <>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <button className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-md font-medium text-sm shadow-md hover:bg-gray-50 flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      Show all photos
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mb-8">
        {renderGrid()}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}
          >
            {/* Dark glass background */}
            <div style={{ position: "absolute", inset: 0, background: "rgba(20,36,43,0.85)", backdropFilter: "blur(16px)" }} onClick={() => setLightboxIndex(null)} />
            
            <button 
              onClick={() => setLightboxIndex(null)} 
              className="glass-chip"
              style={{ position: "absolute", top: "24px", right: "24px", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "24px", cursor: "pointer", zIndex: 1001, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              &times;
            </button>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0 24px", zIndex: 1001 }}>
              <button 
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + images.length) % images.length); }}
                className="glass-chip"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "32px", width: "56px", height: "56px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                &lsaquo;
              </button>
              
              <div style={{ position: "relative", width: "calc(100vw - 160px)", height: "80vh", maxWidth: "1200px" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={lightboxIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    style={{ position: "absolute", inset: 0 }}
                  >
                    <Image 
                      src={getSafeUrl(images[lightboxIndex].url)}
                      alt={images[lightboxIndex].label || "Gallery Image"}
                      fill
                      style={{ objectFit: "contain" }} 
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % images.length); }}
                className="glass-chip"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "32px", width: "56px", height: "56px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                &rsaquo;
              </button>
            </div>
            {images[lightboxIndex].label && (
              <div className="glass-chip" style={{ color: "#fff", marginTop: "24px", fontSize: "16px", zIndex: 1001, padding: "8px 24px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                {images[lightboxIndex].label}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
