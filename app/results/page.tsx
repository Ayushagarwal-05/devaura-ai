"use client";

import { useEffect, useState } from "react";

export default function ResultsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadAura() {
      const res = await fetch("/api/aura");
      const json = await res.json();

      setData(json);
    }

    loadAura();
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold animate-pulse">
            Reading Your Aura...
          </h1>

          <div className="w-64 h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-cyan-400 to-purple-500 animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  const profile = data.profile;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-7xl font-black mb-4">
            Developer Aura
          </h1>

          <p className="text-zinc-400 text-xl">
            AI-generated identity analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* LEFT */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
            <img
              src={profile.image}
              alt="profile"
              className="w-32 h-32 rounded-full border-4 border-cyan-400 mb-6"
            />

            <h2 className="text-5xl font-bold">
              {profile.name}
            </h2>

            <p className="text-cyan-400 text-2xl mt-2">
              @{profile.username}
            </p>

            <p className="text-zinc-300 mt-8 text-lg leading-relaxed">
              {profile.bio}
            </p>

            <div className="flex gap-4 mt-10">
              <div className="bg-zinc-900 rounded-2xl px-6 py-4">
                <p className="text-zinc-500 text-sm">
                  Reputation
                </p>

                <h3 className="text-4xl font-bold text-purple-400">
                  {profile.reputation}
                </h3>
              </div>

              <div className="bg-zinc-900 rounded-2xl px-6 py-4">
                <p className="text-zinc-500 text-sm">
                  Experience
                </p>

                <h3 className="text-2xl font-bold text-cyan-400">
                  {profile.experienceLevel}
                </h3>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 border border-cyan-500/20 rounded-3xl p-8 shadow-[0_0_60px_rgba(0,255,255,0.08)]">
            <div className="uppercase tracking-[0.3em] text-cyan-400 text-sm mb-6">
              AI Aura Prediction
            </div>

            <div className="whitespace-pre-wrap text-zinc-200 leading-relaxed text-lg">
              {data.aura}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}