"use client";

import React, { useState } from "react";

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
            style={{ 
              cursor: "pointer", 
              flex: "0 0 auto",
              width: i === 0 ? "85%" : "60%",
              maxWidth: "900px",
              height: "50vh",
              minHeight: "400px",
              maxHeight: "600px",
              scrollSnapAlign: "center",
              borderRadius: "16px",
              overflow: "hidden",
              position: "relative",
              background: "var(--placeholder-bg)"
            }}
          >
            <img 
              src={img.url} 
              alt={img.label || `Image ${i+1}`} 
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }} 
              onMouseOver={e => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />

      {lightboxIndex !== null && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.9)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <button 
            onClick={() => setLightboxIndex(null)} 
            style={{ position: "absolute", top: "24px", right: "24px", background: "none", border: "none", color: "#fff", fontSize: "36px", cursor: "pointer", zIndex: 1001 }}
          >
            &times;
          </button>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0 24px" }}>
            <button 
              onClick={() => setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)}
              style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: "32px", width: "48px", height: "48px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              &lsaquo;
            </button>
            
            <img 
              src={images[lightboxIndex].url} 
              alt={images[lightboxIndex].label || "Gallery Image"}
              style={{ maxWidth: "calc(100vw - 160px)", maxHeight: "80vh", objectFit: "contain" }} 
            />
            
            <button 
              onClick={() => setLightboxIndex((lightboxIndex + 1) % images.length)}
              style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: "32px", width: "48px", height: "48px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              &rsaquo;
            </button>
          </div>
          {images[lightboxIndex].label && (
            <div style={{ color: "#fff", marginTop: "16px", fontSize: "16px" }}>{images[lightboxIndex].label}</div>
          )}
        </div>
      )}
    </>
  );
}
