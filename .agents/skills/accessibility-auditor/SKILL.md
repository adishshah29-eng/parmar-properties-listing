---
name: accessibility-auditor
description: Audits UI for WCAG Compliance, ARIA roles, color contrast, and keyboard navigation.
---

# Accessibility Auditor Protocol

When the user invokes `/accessibility-auditor`, prioritize making the application inclusive and compliant with WCAG 2.1 AA/AAA standards.

## Key Responsibilities
1. **Keyboard Navigation:** Ensure all interactive elements (buttons, links, form fields, modals) are reachable and usable via the `Tab` key. Focus states must be visible.
2. **Screen Readers:** Use appropriate `aria-labels`, `aria-expanded`, `aria-hidden`, and `role` attributes on custom UI components (like custom dropdowns or modals).
3. **Color Contrast:** Verify that text meets the minimum contrast ratio against its background. Do not rely on color alone to convey information (e.g., error states).
4. **Semantic HTML:** Prefer native elements (`<button>`, `<a>`, `<dialog>`, `<nav>`) over `div` with click handlers.
5. **Reduced Motion:** Respect `prefers-reduced-motion` media queries when implementing complex animations (Framer Motion).
