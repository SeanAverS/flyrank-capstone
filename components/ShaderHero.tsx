'use client';

import React, { useEffect, useState } from 'react';

// Handle the animated background effect
export default function ShaderHero() {
    // Track accessiblity settings for motion 
  const [reducedMotion, setReducedMotion] = useState(false);

    // Listen for user motion preferences 
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Fallback if reduced motion is preferred
  if (reducedMotion) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 z-0 pointer-events-none" />
    );
  }

  // Ambient background layer
  return (
    <div className="absolute inset-0 overflow-hidden z-0 bg-slate-950 pointer-events-none">
      <div className="absolute -inset-[100%] opacity-50 animate-pulse bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 via-slate-950 to-black blur-3xl" />
    </div>
  );
}