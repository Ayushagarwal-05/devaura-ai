"use client";

import { domToPng } from "modern-screenshot";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AURA_CACHE_PREFIX = "devaura:aura:";

function getUsernameFromSearch() {
  if (typeof window === "undefined") return "ayu_buildss";
  const params = new URLSearchParams(window.location.search);
  return params.get("username") || "ayu_buildss";
}

export default function ResultsPage() {
  const [username] = useState(getUsernameFromSearch);
  const [data, setData] = useState<any>(() => {
    if (typeof window === "undefined") return null;
    const cacheKey = `${AURA_CACHE_PREFIX}${getUsernameFromSearch()}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (data) return;
    let active = true;
    const controller = new AbortController();

    async function loadAura() {
      const res = await fetch(
        `/api/aura?username=${encodeURIComponent(username)}`,
        { signal: controller.signal }
      );
      if (!res.ok) return;
      const json = await res.json();
      if (!active) return;
      try {
        sessionStorage.setItem(
          `${AURA_CACHE_PREFIX}${username}`,
          JSON.stringify(json)
        );
      } catch {
        // Ignore sessionStorage quota errors.
      }
      setData(json);
    }

    loadAura();
    return () => {
      active = false;
      controller.abort();
    };
  }, [data, username]);

  if (!data) {
    return <main className="min-h-screen bg-black" />;
  }

  const profile = data.profile;
  const aura = data.aura;

  return (
    <main
      id="aura-card"
      className="min-h-screen bg-black text-white px-6 py-16 relative"
    >
      {/* BACKGROUND GLOWS */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-4">
            Developer Aura
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl">
            AI-generated identity analysis
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* LEFT CARD */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="bg-zinc-950/90 backdrop-blur border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={profile.image}
                alt="profile"
                className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-cyan-400 shadow-[0_0_40px_rgba(0,255,255,0.35)]"
              />

              <div className="min-w-0">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight break-words">
                  {profile.name}
                </h2>

                <p className="text-cyan-400 text-xl md:text-2xl mt-2 break-all">
                  @{profile.username}
                </p>

                <p className="text-zinc-500 mt-3 text-sm md:text-base">
                  {aura.vibe}
                </p>
              </div>
            </div>

            <p className="text-zinc-300 mt-10 text-lg leading-relaxed">
              {profile.bio}
            </p>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 mt-10">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-zinc-900 rounded-2xl px-6 py-5"
              >
                <p className="text-zinc-500 text-sm">
                  Reputation
                </p>

                <h3 className="text-4xl md:text-5xl font-bold text-purple-400 mt-2">
                  {profile.reputation}
                </h3>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-zinc-900 rounded-2xl px-6 py-5"
              >
                <p className="text-zinc-500 text-sm">
                  Aura Score
                </p>

                <h3 className="text-4xl md:text-5xl font-bold text-cyan-400 mt-2">
                  {aura.auraScore * 10}
                </h3>
              </motion.div>
            </div>

            {/* STRENGTHS */}
            <div className="mt-12">
              <h3 className="uppercase tracking-[0.3em] text-zinc-400 text-sm mb-5">
                Strength Matrix
              </h3>

              <div className="flex flex-col gap-3">
                {aura.strengths.map(
                  (strength: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: index * 0.15,
                      }}
                      whileHover={{
                        scale: 1.02,
                      }}
                      className="px-5 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 w-full break-words"
                    >
                      {strength}
                    </motion.div>
                  )
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT CARD */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="bg-gradient-to-br from-zinc-950 to-zinc-900 border border-cyan-500/20 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(0,255,255,0.08)]"
          >
            <div className="uppercase tracking-[0.3em] text-cyan-400 text-sm mb-6">
              AI Aura Prediction
            </div>

            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-none break-words">
              {aura.archetype}
            </h2>

            <div className="space-y-10">
              <div>
                <h3 className="text-zinc-500 uppercase text-sm mb-4 tracking-widest">
                  Personality Summary
                </h3>

                <p className="text-zinc-200 text-lg md:text-xl leading-relaxed">
                  {aura.summary}
                </p>
              </div>

              <div>
                <h3 className="text-zinc-500 uppercase text-sm mb-4 tracking-widest">
                  Future Prediction
                </h3>

                <p className="text-zinc-200 text-lg md:text-xl leading-relaxed">
                  {aura.futurePrediction}
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="pt-6 flex gap-4 capture-hide"
              >
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `I got "${aura.archetype}" on DevAura AI 🔥`
                    );

                    alert("Aura copied to clipboard!");
                  }}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold text-lg hover:scale-[1.02] transition-all"
                >
                  Share Aura
                </button>

                <button
                  onClick={async () => {
                    const hidden =
                      document.querySelectorAll(
                        ".capture-hide"
                      );

                    hidden.forEach((el) => {
                      (
                        el as HTMLElement
                      ).style.display = "none";
                    });

                    const element =
                      document.getElementById(
                        "aura-card"
                      );

                    if (!element) return;

                    const dataUrl =
                      await domToPng(
                        element,
                        {
                          width:
                            element.scrollWidth,

                          height:
                            element.scrollHeight,

                          bgcolor:
                            "#000000",
                        }
                      );

                    hidden.forEach((el) => {
                      (
                        el as HTMLElement
                      ).style.display = "flex";
                    });

                    const link =
                      document.createElement("a");

                    link.download =
                      `${profile.username}-aura.png`;

                    link.href = dataUrl;

                    link.click();
                  }}
                  className="flex-1 py-4 rounded-2xl border border-cyan-400 text-cyan-300 font-bold text-lg hover:bg-cyan-400/10 transition-all"
                >
                  Download
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}