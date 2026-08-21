'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

// Lazyload + SSR disabled
const Pedal3DView = dynamic(
  () => import('@/components/Pedal3DView'),
  { ssr: false, loading: () => <div className="text-white p-8">Loading 3D Pedal Experience...</div> }
);

export default function Page() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8 max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider">FE-AA2: 3D Pedal Experience</h1>
          <p className="text-zinc-400 text-sm">Interactive 3D guitar pedal viewer with Leva configurator & footswitch state toggle.</p>
        </div>
      </div>

      <Pedal3DView />
    </main>
  );
}