"use client";

import React, { useState } from "react";
import Image from "next/image";

import { motion, AnimatePresence } from "framer-motion";

export default function ImageGalleryClient({ images }: { images: any[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div 
        style={{ 
          display: "flex", 
          overflowX: "auto", 
          gap: "16px", 
          scrollSnapType: "x mandatory", 
          paddingBottom: "16px", 
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none"
        }}
        className="hide-scrollbar"
      >
        {images.map((img, i) => (
          <div 
            key={img.id} 
            onClick={() => setLightboxIndex(i)} 
            className="glass"
            style={{ 
              cursor: "pointer", 
              flex: "0 0 auto",
              width: i === 0 ? "85%" : "60%",
              maxWidth: "900px",
              height: "60vh",
              minHeight: "400px",
              maxHeight: "700px",
              scrollSnapAlign: "center",
              borderRadius: "24px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image 
              src={img.url.startsWith('/') || img.url.startsWith('http') ? img.url : '/' + img.url}
              alt={img.label || `Image ${i+1}`} 
              fill
              style={{ objectFit: "cover", transition: "transform 0.4s ease" }} 
              onMouseOver={e => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />

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
                      src={images[lightboxIndex].url.startsWith('/') || images[lightboxIndex].url.startsWith('http') ? images[lightboxIndex].url : '/' + images[lightboxIndex].url}
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
