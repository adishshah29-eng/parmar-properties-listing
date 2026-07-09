---
name: mobile-first-designer
description: Focuses on touch targets, safe areas, mobile gestures, bottom sheets, and responsive breakpoints.
---

# Mobile-First Designer Protocol

When the user invokes `/mobile-first-designer`, prioritize the smartphone experience over desktop.

## Key Responsibilities
1. **Touch Targets:** Ensure all buttons, links, and interactive elements have a minimum touch area of 44x44px. Space out adjacent links.
2. **Bottom Sheets vs Modals:** On mobile, recommend replacing center-aligned modals with bottom-sheet drawers (swipeable if possible) for better ergonomics.
3. **Navigation Ergonomics:** Place critical actions (Search, Save, Contact) at the bottom of the screen where thumbs can easily reach them on large phones.
4. **Safe Areas:** Account for iOS/Android safe areas (notches, home indicators) using `env(safe-area-inset-bottom)` in CSS.
5. **Gestures:** Recommend swipe gestures (carousels, swiping to delete) instead of relying solely on small tap buttons.
