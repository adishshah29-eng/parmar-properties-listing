"use client";

import React, { useEffect, useRef, useState } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

interface HeroScrollAnimationProps {
  scrollYProgress: MotionValue<number>;
  totalFrames?: number;
}

export function HeroScrollAnimation({
  scrollYProgress,
  totalFrames = 240,
}: HeroScrollAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // Preload all frames
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new window.Image();
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `/frames/ezgif-frame-${paddedIndex}.jpg`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          setImagesLoaded(true);
        }
      };

      images.push(img);
    }
    
    imagesRef.current = images;
  }, [totalFrames]);

  // Initial draw once first frame or all frames load
  useEffect(() => {
    if (imagesLoaded && canvasRef.current && imagesRef.current.length > 0) {
      renderFrame(0);
    }
  }, [imagesLoaded]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!imagesLoaded) return;
    
    const frameIndex = Math.floor(latest * (totalFrames - 1));
    renderFrame(frameIndex);
  });

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const image = imagesRef.current[index];

    if (ctx && image && image.complete) {
      // Get logical CSS pixels
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Set physical pixels
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Calculate object-cover dimensions to fill the canvas
      const hRatio = canvas.width / image.width;
      const vRatio = canvas.height / image.height;
      const ratio = Math.max(hRatio, vRatio);
      
      const drawWidth = image.width * ratio;
      const drawHeight = image.height * ratio;
      const drawX = (canvas.width - drawWidth) / 2;
      const drawY = (canvas.height - drawHeight) / 2;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        image,
        0, 0, image.width, image.height,
        drawX, drawY, drawWidth, drawHeight
      );
    }
  };

  // Re-render when window resizes to update canvas physical bounds
  useEffect(() => {
    const handleResize = () => {
      const latest = scrollYProgress.get();
      const frameIndex = Math.floor(latest * (totalFrames - 1));
      renderFrame(frameIndex);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imagesLoaded, totalFrames, scrollYProgress]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      {!imagesLoaded && (
        <div className="absolute inset-0 bg-[#0D1A13]" />
      )}
    </div>
  );
}
