"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { useScroll, motion, useTransform, MotionValue, useSpring, useMotionValueEvent } from "framer-motion";
import { HeroScrollAnimation } from "./HeroScrollAnimation";

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

function ScrollWord({ 
  word, 
  wordGlobalCharOffset,
  start,
  fadeInEnd,
  fadeOutStart,
  end,
  isLast,
  baseStagger = 0.002,
  scrollYProgress 
}: { 
  word: string; 
  wordGlobalCharOffset: number;
  start: number;
  fadeInEnd: number;
  fadeOutStart: number;
  end: number;
  isLast: boolean;
  baseStagger?: number;
  scrollYProgress: MotionValue<number>;
}) {
  const wordStart = start + wordGlobalCharOffset * baseStagger;
  const wordFadeInEnd = fadeInEnd + wordGlobalCharOffset * baseStagger;
  const wordFadeOutStart = fadeOutStart + wordGlobalCharOffset * (baseStagger * 0.5);
  const wordEnd = end + wordGlobalCharOffset * (baseStagger * 0.5);

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  const t1 = clamp(wordStart, 0, 1);
  const t2 = clamp(wordFadeInEnd, t1, 1);
  const t3 = clamp(wordFadeOutStart, t2, 1);
  const t4 = clamp(wordEnd, t3, 1);
  
  const inputRange = [t1, t2, t3, t4];

  const y = useTransform(
    scrollYProgress,
    inputRange,
    [20, 0, 0, isLast ? 0 : -20]
  );
  
  const scale = useTransform(
    scrollYProgress,
    inputRange,
    [0.95, 1, 1, isLast ? 1 : 0.95]
  );

  const opacity = useTransform(
    scrollYProgress,
    inputRange,
    [0, 1, 1, isLast ? 1 : 0]
  );

  return (
    <span className="inline-block pb-4 -mb-4 align-top mr-[0.25em]">
      <motion.span 
        style={{ 
          y, 
          scale,
          opacity, 
          display: "inline-block",
          willChange: "transform, opacity"
        }}
      >
        {word}
      </motion.span>
    </span>
  );
}

function ScrollContentBlockItem({ 
  block, 
  index, 
  totalBlocks, 
  scrollYProgress 
}: { 
  block: { title: string; subtitle: string }; 
  index: number; 
  totalBlocks: number; 
  scrollYProgress: MotionValue<number>;
}) {
  const segment = 1 / totalBlocks;
  const start = index * segment;
  const end = start + segment;
  
  // Culling bounds with 10% segment hysteresis margin
  const margin = segment * 0.1;
  const visibleStart = start - segment - margin;
  const visibleEnd = end + segment + margin;
  
  const [isNear, setIsNear] = useState(() => {
    const initial = scrollYProgress.get();
    return initial >= visibleStart && initial <= visibleEnd;
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const near = latest >= visibleStart && latest <= visibleEnd;
    if (near !== isNear) setIsNear(near);
  });

  // Timings
  const fadeInEnd = start + segment * 0.2;
  const fadeOutStart = end - segment * 0.2;
  const isLast = index === totalBlocks - 1;

  // Overall opacity for smooth edges
  const opacityOut = isLast ? 1 : 0;
  const opacity = useTransform(
    scrollYProgress,
    [start, start + segment * 0.05, fadeOutStart, end],
    [0, 1, 1, opacityOut]
  );

  const titleWords = useMemo(() => {
    let titleCharCount = 0;
    return block.title.split(" ").map(word => {
      const offset = titleCharCount;
      titleCharCount += word.length;
      return { word, offset };
    });
  }, [block.title]);

  const subtitleWords = useMemo(() => {
    let titleChars = block.title.replace(/ /g, "").length;
    let subtitleCharCount = titleChars * 0.35;
    return block.subtitle.split(" ").map(word => {
      const offset = subtitleCharCount;
      subtitleCharCount += word.length;
      return { word, offset };
    });
  }, [block.title, block.subtitle]);

  const isEven = index % 2 === 0;

  if (!isNear) return null;

  return (
    <motion.div
      style={{ opacity }}
      className={`absolute flex flex-col px-6 md:px-12 w-full max-w-7xl ${isEven ? 'items-start text-left' : 'items-end text-right'}`}
    >
      {/* Title */}
      <div className="mb-4">
        <h2 
          className={`font-serif text-4xl md:text-6xl lg:text-7xl text-white font-medium leading-tight flex flex-wrap gap-y-2 ${isEven ? 'justify-start' : 'justify-end'}`}
          style={{ textShadow: "0 2px 24px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.8)" }}
        >
          {titleWords.map((item, wIndex) => (
            <ScrollWord 
              key={wIndex}
              word={item.word}
              wordGlobalCharOffset={item.offset}
              start={start}
              fadeInEnd={fadeInEnd}
              fadeOutStart={fadeOutStart}
              end={end}
              isLast={isLast}
              baseStagger={0.002}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </h2>
      </div>
      
      {/* Spacer */}
      <div className="h-4" />

      {/* Subtitle */}
      <div>
        <p 
          className={`font-sans text-sm md:text-xl text-[#b59e7e] tracking-[0.05em] font-medium flex flex-wrap gap-y-1 ${isEven ? 'justify-start' : 'justify-end'}`}
          style={{ textShadow: "0 2px 24px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.8)" }}
        >
          {subtitleWords.map((item, wIndex) => (
            <ScrollWord 
              key={wIndex}
              word={item.word}
              wordGlobalCharOffset={item.offset}
              start={start}
              fadeInEnd={fadeInEnd}
              fadeOutStart={fadeOutStart}
              end={end}
              isLast={isLast}
              baseStagger={0.0015}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </p>
      </div>
    </motion.div>
  );
}

function ScrollContentLayer({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = layerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={layerRef} className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
      {visible && BLOCKS.map((block, index) => (
        <ScrollContentBlockItem
          key={index}
          block={block}
          index={index}
          totalBlocks={BLOCKS.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}

export function HeroScrollContainer({ children }: { children?: React.ReactNode }) {
  const containerRef = useRef<HTMLElement>(null);
  
  // Get raw scroll progress
  const { scrollYProgress: rawProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Apply a spring physics smoothing to the scroll progress
  // This removes any jerky mouse-wheel or trackpad movements and makes everything buttery smooth
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 50,
    damping: 15,
    mass: 0.1,
    restDelta: 0.001
  });

  // Scale down and dock effect at the very end of the scroll
  const scale = useTransform(scrollYProgress, [0.85, 1], [1, 0.95]);
  const borderRadius = useTransform(scrollYProgress, [0.85, 1], ["0px", "32px"]);

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-[#000000]">
      <motion.div 
        style={{ scale, borderRadius }}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-end transform-gpu"
      >
        <HeroScrollAnimation scrollYProgress={scrollYProgress} totalFrames={240} />
        
        {/* Cinematic Film Grain Overlay (Option 3) */}
        <div className="absolute inset-0 bg-noise z-10" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/60 via-[#000000]/10 to-transparent pointer-events-none z-10" />
        
        <ScrollContentLayer scrollYProgress={scrollYProgress} />
        
        {/* The content children that overlay on top of the animation */}
        <div className="relative z-30 w-full pointer-events-auto">
          {children}
        </div>
      </motion.div>
    </section>
  );
}
