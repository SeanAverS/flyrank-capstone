// FE-AA1 assignment demo
"use client";

import { useState } from "react";
import ChatBox from "@/components/ChatBox";

export default function AssignmentDemoPage() {
  const [forcedState, setForcedState] = useState<"success" | "error" | null>(null);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6">
      <div className="w-full max-w-xl mb-4 flex flex-col space-y-2">
        <h1 className="text-slate-100 font-bold text-lg text-center">
          FE-AA1 Assignment Demo
        </h1>
        <p className="text-slate-400 text-xs text-center">
          For reviewer: Controls force success or error states. 
        </p>
      </div>

      {/* Reviewer Demo Triggers */}
      <div className="mb-4 flex items-center justify-center space-x-2 bg-slate-900 border border-slate-800 p-3 rounded-xl w-full max-w-xl">
        <button
          onClick={() => setForcedState("success")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            forcedState === "success" 
              ? "bg-emerald-500 text-slate-950 shadow-md" 
              : "bg-slate-800 text-slate-200 hover:bg-slate-700"
          }`}
        >
          Success State
        </button>
        <button
          onClick={() => setForcedState("error")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            forcedState === "error" 
              ? "bg-rose-600 text-white shadow-md" 
              : "bg-slate-800 text-slate-200 hover:bg-slate-700"
          }`}
        >
          Error State
        </button>
        <button
          onClick={() => setForcedState(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            forcedState === null 
              ? "bg-indigo-600 text-white shadow-md" 
              : "bg-slate-800 text-slate-200 hover:bg-slate-700"
          }`}
        >
          Reset
        </button>
      </div>

      <ChatBox forcedState={forcedState} />
    </main>
  );
}