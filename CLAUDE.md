# Tooling Commands
- Dev: `npm run dev`
- Build: `npm run build`

# Style Guidelines
- Stack: Next.js (App Router), React, Tailwind CSS
- Pattern: Functional components, explicit exports

# Three AI Rules (from Week 2 assignment)
1. **Next.js Root Layout Structure:** When generating root routes, preserve key entry points like `import './globals.css';` to avoid decoupling Tailwind engine configurations.
2. **Enterprise UI Constraints:** Combine (`disabled={isSubmitting}`) with accessibility states (`aria-invalid`, `aria-describedby`) on all terminal interactive elements during form submissions.
3. **Asynchronous Test Timers:** Avoid testing using fake timers like `vi.useFakeTimers()` when components rely on asynchronous microtask libraries (react-hook-form). To prevent tests from failing, use real timers combined with `await waitFor()`. 
