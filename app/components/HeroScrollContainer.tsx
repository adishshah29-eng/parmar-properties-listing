"use client";

import React, { useRef } from "react";
import { useScroll } from "framer-motion";
import { HeroScrollAnimation } from "./HeroScrollAnimation";

export function HeroScrollContainer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-[#0D1A13]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-end">
        <HeroScrollAnimation scrollYProgress={scrollYProgress} totalFrames={240} />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1A13]/85 via-[#0D1A13]/25 to-transparent pointer-events-none" />
        
        {/* The content children that overlay on top of the animation */}
        <div className="relative z-10 w-full pointer-events-auto">
          {children}
        </div>
      </div>
    </section>
  );
}
