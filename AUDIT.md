# FE-10: Accessibility and Performance Audit

## 1. Audit Scores
* **Lighthouse Performance:** 100
* **Lighthouse Accessibility:** 86
* **Lighthouse Best Practices:** 100
* **Lighthouse SEO:** 100
* **WAVE Errors:** 0 errors

> ![Lighthouse Audit](docs/lighthouse-audit.png)

## 2. Issues Discovered & Fixes Applied
* **Landmarks & Semantics:** Semantic HTML elements (`<main>`, `<nav>`) are structured properly across the application.
* **AI Chat Accessibility:** Integrated `aria-live="polite"` and `aria-relevant="additions"` on `ChatBox` to ensure screen readers announce incoming assistant tokens. Verified keyboard reachability (`Tab`) and `Enter` key handling for dynamic Send/Stop buttons.
* **Keyboard-Only Navigation Pass:** Verified primary flow (navigating app, interacting with canvas controls, typing and submitting chat queries, toggling stop button) can be completed using only the keyboard.
* **Performance & Asset Loading:** Optimized components, layout shifts, and script delivery to maintain high mobile performance score.