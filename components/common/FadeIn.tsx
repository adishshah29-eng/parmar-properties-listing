"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FadeIn({ 
  children, 
  delay = 0, 
  className = "", 
  style = {} 
}: { 
  children: React.ReactNode, 
  delay?: number, 
  className?: string, 
  style?: React.CSSProperties 
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay,
        ease: "power3.out", // Similar to [0.22, 1, 0.36, 1] curve
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom-=50px", // Replicates viewport={{ margin: "-50px" }}
          toggleActions: "play none none none", // Replicates viewport={{ once: true }}
        }
      }
    );
  }, { scope: ref });

  // Notice we don't start with opacity-0 class to ensure SEO bots and no-JS still see the content
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
