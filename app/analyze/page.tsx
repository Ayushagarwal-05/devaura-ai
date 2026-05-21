"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/results");
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden relative">
      
      {/* Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full" />

      <div className="relative z-10 text-center space-y-8 px-6">
        
        <div className="space-y-4">
          <p className="uppercase tracking-[0.3em] text-cyan-400 text-sm">
            DevAura AI Engine
          </p>

          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Analyzing Your
            <span className="block bg-gradient-to-r from-purple-400 via-cyan-400 to-orange-400 bg-clip-text text-transparent">
              Developer Aura
            </span>
          </h1>

          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Processing reading habits, stack patterns, learning velocity,
            and archetype resonance across the ecosystem.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div className="h-full w-2/3 bg-gradient-to-r from-purple-500 via-cyan-400 to-orange-400 animate-pulse rounded-full" />
          </div>

          <div className="flex justify-between text-sm text-zinc-500">
            <span>Signal Scan</span>
            <span>67%</span>
          </div>
        </div>

        {/* Fake AI Logs */}
        <div className="max-w-xl mx-auto text-left bg-zinc-950/70 border border-zinc-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="space-y-2 text-sm font-mono text-zinc-400">
            <p>✓ Parsing developer patterns...</p>
            <p>✓ Mapping tech ecosystem signals...</p>
            <p>✓ Detecting archetype alignment...</p>
            <p className="text-cyan-400">
              → Generating cinematic identity card...
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}