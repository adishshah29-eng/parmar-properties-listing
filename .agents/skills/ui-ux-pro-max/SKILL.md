---
name: ui-ux-pro-max
description: Use this skill to apply ultra-premium, high-end UI/UX design principles (micro-animations, glassmorphism, cinematic effects) to any web interface.
---

# UI/UX Pro Max Guidelines

When this skill is triggered, you must elevate the standard web interface into a **jaw-dropping, premium experience**. You are not just a developer; you are an award-winning Digital Art Director.

## 1. Core Aesthetic (The "Pro Max" Look)
- **Glassmorphism:** Use frosted glass effects (`backdrop-blur-md`, semi-transparent backgrounds with subtle white/black borders) instead of flat, solid colors for cards, badges, and overlays.
- **Lighting & Depth:** Do not use harsh shadows. Use large, soft, colored shadows (e.g., `shadow-2xl shadow-black/10` or `shadow-primary/20`) to create a sense of physical depth. Elements should feel like they are floating on different z-layers.
- **Typography:** Treat typography as art. Use high-contrast font pairings (e.g., a sophisticated Serif for headings like Playfair Display, and a clean Sans-Serif like Inter for body). Ensure generous line-height (`leading-relaxed`) and letter-spacing (`tracking-wide` for caps).

## 2. Micro-Interactions (The Magic)
- **Hover States:** Every interactive element must have a thoughtful hover state. Do not just change colors. Use scaling (`scale-[1.02]`), vertical lifting (`-translate-y-1`), and shadow expansion.
- **The "Netflix Effect":** When rendering a grid of cards, hovering over one card should highlight it (scale up, increase z-index) while simultaneously dimming the sibling cards (opacity drop) to focus the user's attention.
- **Cinematic Images (Ken Burns):** Images inside cards or heroes should always slowly zoom in on hover (`transition-transform duration-1000 ease-out hover:scale-110`) while the container remains `overflow-hidden`.

## 3. Motion & Animation
- **Spring Physics over Linear Easing:** When animating layouts, dialogs, or scrolling, prefer spring-based physics (using Framer Motion) over standard CSS `ease-in-out`. It feels more organic, natural, and "Apple-like".
- **Staggered Entrances:** Never let a list or grid of items pop in all at once. Use staggered delays so elements elegantly cascade into view.
- **Performance First:** Never animate expensive CSS properties like `filter: blur`, `box-shadow`, or `layout` on scroll. Only animate `transform` (scale, translate) and `opacity`.

## 4. The Final Polish
- **Remove Scrollbars:** Hide ugly default browser scrollbars on horizontal carousels or custom sidebars while keeping the scrolling functional.
- **Whitespace:** Double the whitespace you think you need. Premium design breathes. Do not cram elements together.

**Always remember:** If it looks like a standard Bootstrap or Material template, you have failed the Pro Max standard. Make it cinematic.
