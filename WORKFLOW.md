# Engineering Workflow Analysis: Branch Diff & Model Comparison

This document breaks down the code quality differences between the vague prompt (`feature/contact-form-vague`) and our precise prompt (`feature/contact-form-precise`).

---

## 📈 Core Rubric Evaluation

### 1. Correctness & Architecture
The vague prompt builds an overly complex schema that included an unnecessary `subject` field. The precise branch optimizes this, tracking only `name`, `email`, and `message` using `contactFormSchema`. The precise version also shifts error handling out of brittle manual react states and unifies them into type-safe Zod schema validation handled directly inside React Hook Form's `useForm`.

### 2. Accessibility Compliance (a11y)
The vague branch barely addressed accessibility, using standard HTML inputs. The precise prompt forced modern compliance standards. Key additions include adding `noValidate` to the form element for custom error handling, injecting `role="alert"` alongside `aria-live="polite"` inside the success banner, and mapping inputs with active links like `aria-invalid={errors.name ? 'true' : 'false'}` and `aria-describedby="name-error"`. Screen readers can now actively track and announce real-time context.

### 3. Edge Cases & Async Lifecycles
The vague branch submitted forms instantly without UI safety blocks. The precise branch respects async user states and prevents duplicate transactions by mapping `disabled={isSubmitting}` to all interactive inputs and textareas, styled with `disabled:opacity-50 disabled:cursor-not-allowed` to block double-submissions.

### 4. Review Effort & AI Mistakes Caught
While the precise branch delivered a much tighter architectural structure, it actually increased manual review effort because of two critical AI mistakes caught during testing:
* **The Asynchronous Timer Trap:** The AI model configured the testing suite with Vitest's `vi.useFakeTimers()` to skip the simulated submission delay. However, freezing the clock blocked `react-hook-form`'s internal async microtask promises from resolving, causing the test runner to hang and timeout. This was fixed by using real timers with standard async `waitFor` loops.
* **The Root Style Decoupling:** The model accidentally scrubbed the framework stylesheet link (`import './globals.css';`) from the root layout. This broke Tailwind engine injections, forcing a manual file patch to restore global layouts.

---

## 💡 Key Takeaway
Vague prompting minimizes review effort upfront but yields fragile, inaccessible code. Precise prompting delivers enterprise-grade architecture and accessibility, but shifts the review effort toward diagnosing complex integration flaws hidden within automated test configurations and layout caches.