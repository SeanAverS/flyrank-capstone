import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Virtual Pedalboard",
  description: "An interactive guitar rig in your browser",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-950 text-slate-100">
      <body className="flex min-h-screen flex-col">
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
            <Link href="/" className="text-xl font-bold tracking-wider text-emerald-400">
              🎛️ PEDAL PLAY
            </Link>
            <nav className="flex gap-6">
              <Link href="/" className="hover:text-emerald-400 transition-colors">Pedalboard</Link>
              <Link href="/health-check" className="hover:text-emerald-400 transition-colors">Health Check</Link>
            </nav>
          </div>
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="border-t border-slate-900 bg-slate-950 p-4 text-center text-sm text-slate-600">
          Built by{" "}
          <a
            href="https://github.com/SeanAverS"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors"
          >
            Sean
          </a>
          .
        </footer>
      </body>
    </html>
  );
}