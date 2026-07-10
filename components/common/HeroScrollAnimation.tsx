"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface HeroScrollAnimationProps {
  scrollYProgress?: any; // Kept for backwards compatibility if needed, but unused
  totalFrames?: number;
  holdFrames?: number;
}

export function HeroScrollAnimation({
  totalFrames = 240,
  holdFrames = 30, // Extra frames to hold at the end
}: HeroScrollAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // Preload all frames
    const isMobile = window.innerWidth < 768;
    const basePath = isMobile ? "/frames_mobile" : "/frames_desktop";

    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new window.Image();
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `${basePath}/frame-${paddedIndex}.jpg`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) setImagesLoaded(true);
      };

      images.push(img);
    }

    imagesRef.current = images;
  }, [totalFrames]);

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const image = imagesRef.current[index];

    if (ctx && image && image.complete) {
      // Calculate object-cover dimensions to fill the canvas
      const hRatio = canvas.width / image.width;
      const vRatio = canvas.height / image.height;
      const ratio = Math.max(hRatio, vRatio);
      
      const drawWidth = image.width * ratio;
      const drawHeight = image.height * ratio;
      const drawX = (canvas.width - drawWidth) / 2;
      const drawY = (canvas.height - drawHeight) / 2;
      
      // Since canvas is sized physically once, we don't clear and resize every frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        image,
        0, 0, image.width, image.height,
        drawX, drawY, drawWidth, drawHeight
      );
    }
  };

  useGSAP(() => {
    if (!imagesLoaded || !canvasRef.current || !containerRef.current) return;
    
    // Set canvas physical pixels ONCE here (and on resize) to prevent layout thrashing
    const setCanvasSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Redraw the current frame after resize
      if (frameObj.frame !== undefined) {
        renderFrame(Math.floor(frameObj.frame));
      } else {
        renderFrame(0);
      }
    };
    
    const frameObj = { frame: 0 };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Target the closest parent section which has the 300vh scroll height
    const triggerSection = containerRef.current.closest('section');
    const totalWithHold = totalFrames + holdFrames;

    // The GSAP Canvas Sequence Pattern
    gsap.to(frameObj, {
      frame: totalFrames - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: triggerSection,
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth lag scrubbing (1 second delay)
      },
      onUpdate: () => {
        // Clamp it just in case, though snap: "frame" keeps it whole
        const frameIndex = Math.min(Math.floor(frameObj.frame), totalFrames - 1);
        renderFrame(frameIndex);
      }
    });

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, [imagesLoaded, totalFrames, holdFrames]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      {!imagesLoaded && (
        <div className="absolute inset-0 bg-[#000000]" />
      )}
    </div>
  );
}
