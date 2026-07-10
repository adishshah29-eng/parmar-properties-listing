"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { HeroScrollAnimation } from "./HeroScrollAnimation";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BLOCKS = [
  {
    title: "Access. Influence. Legacy.",
    subtitle: "South Mumbai's trusted luxury real estate advisory.",
  },
  {
    title: "Established Authority",
    subtitle: "Boutique solutions since 1981.",
  },
  {
    title: "Minimalist Sophistication",
    subtitle: "Integrity, Transparency, Personalized Guidance.",
  },
  {
    title: "Legacy-Driven",
    subtitle: "Expert guidance for high-net-worth investors.",
  }
];

export function HeroScrollContainer({ children }: { children?: React.ReactNode }) {
  const containerRef = useRef<HTMLElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !textLayerRef.current) return;

    // 1. Scale/dock effect for the sticky container at the very end of scroll
    gsap.fromTo(".sticky-wrapper", 
      { scale: 1, borderRadius: "0px" },
      { 
        scale: 0.95, 
        borderRadius: "32px",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "85% bottom",
          end: "bottom bottom",
          scrub: true,
        }
      }
    );

    // 2. The Text Blocks Timeline
    const blocks = gsap.utils.toArray<HTMLElement>('.text-block');
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrub
      }
    });

    blocks.forEach((block, i) => {
      const words = block.querySelectorAll('.word');
      const isLast = i === blocks.length - 1;

      // Block fade in
      tl.fromTo(words, 
        { opacity: 0, y: 20, scale: 0.95 }, 
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 1, 
          stagger: 0.05, 
          ease: "power2.out" 
        }, 
        i === 0 ? 0 : "-=0.5" // overlap with previous block
      );

      // Block fade out (except the last block which stays visible)
      if (!isLast) {
        tl.to(words, 
          { 
            opacity: 0, 
            y: -20, 
            scale: 0.95, 
            duration: 1, 
            stagger: 0.05, 
            ease: "power2.in" 
          }, 
          "+=0.8" // Hold duration before fading out
        );
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-[#000000]">
      <div 
        className="sticky-wrapper sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-end origin-bottom"
      >
        <HeroScrollAnimation totalFrames={240} />
        
        {/* Cinematic Film Grain Overlay */}
        <div className="absolute inset-0 bg-noise z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/60 via-[#000000]/10 to-transparent pointer-events-none z-10" />
        
        {/* Text Layer */}
        <div ref={textLayerRef} className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
          {BLOCKS.map((block, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`text-block absolute flex flex-col px-6 md:px-12 w-full max-w-7xl ${isEven ? 'items-start text-left' : 'items-end text-right'}`}
              >
                <div className="mb-4">
                  <h2 
                    className={`font-serif text-4xl md:text-6xl lg:text-7xl text-white font-medium leading-tight flex flex-wrap gap-y-2 ${isEven ? 'justify-start' : 'justify-end'}`}
                    style={{ textShadow: "0 2px 24px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.8)" }}
                  >
                    {block.title.split(" ").map((word, wIndex) => (
                      <span key={wIndex} className="inline-block pb-4 -mb-4 align-top mr-[0.25em]">
                        <span className="word inline-block opacity-0">{word}</span>
                      </span>
                    ))}
                  </h2>
                </div>
                <div className="h-4" />
                <div>
                  <p 
                    className={`font-sans text-sm md:text-xl text-[#b59e7e] tracking-[0.05em] font-medium flex flex-wrap gap-y-1 ${isEven ? 'justify-start' : 'justify-end'}`}
                    style={{ textShadow: "0 2px 24px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.8)" }}
                  >
                    {block.subtitle.split(" ").map((word, wIndex) => (
                      <span key={wIndex} className="inline-block pb-4 -mb-4 align-top mr-[0.25em]">
                        <span className="word inline-block opacity-0">{word}</span>
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* The content children that overlay on top of the animation */}
        <div className="relative z-30 w-full pointer-events-auto">
          {children}
        </div>
      </div>
    </section>
  );
}
