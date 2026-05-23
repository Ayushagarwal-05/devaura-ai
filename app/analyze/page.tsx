"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const AURA_CACHE_PREFIX = "devaura:aura:";
const MIN_ROUTE_MS = 7600;
const EXIT_OFFSET_MS = 400;

function getUsernameFromSearch() {
  if (typeof window === "undefined") return "ayu_buildss";
  const params = new URLSearchParams(window.location.search);
  return params.get("username") || "ayu_buildss";
}

// ─── LOG LINES ────────────────────────────────────────────────────────────────
const LOGS = [
  {
    symbol: "✓",
    text: "Parsing reading behavior...",
    color: "text-zinc-400",
  },
  {
    symbol: "✓",
    text: "Mapping tech stack affinity...",
    color: "text-zinc-400",
  },
  {
    symbol: "✓",
    text: "Detecting open-source resonance...",
    color: "text-zinc-400",
  },
  {
    symbol: "✓",
    text: "Calculating learning velocity...",
    color: "text-zinc-400",
  },
  {
    symbol: "✓",
    text: "Analyzing engineering depth...",
    color: "text-zinc-400",
  },
  {
    symbol: "✓",
    text: "Estimating creativity index...",
    color: "text-zinc-400",
  },
  {
    symbol: "✓",
    text: "Mapping architecture preference...",
    color: "text-zinc-400",
  },
  {
    symbol: "✓",
    text: "Detecting builder archetype...",
    color: "text-zinc-400",
  },
  {
    symbol: "✓",
    text: "Generating aura signature...",
    color: "text-zinc-400",
  },
  {
    symbol: "→",
    text: "Finalizing cinematic identity...",
    color: "text-cyan-400",
  },
];


const STAGES = [
  "Initializing signal scan...",
  "Mapping ecosystem signals...",
  "Detecting archetype alignment...",
  "Generating identity card...",
];

export default function AnalyzePage() {
  const router = useRouter();
  const startTimeRef = useRef(Date.now());
  const [username] = useState(getUsernameFromSearch);
  const [dataReady, setDataReady] = useState(false);

  // ── Visual state ────────────────────────────────────────
  const [progress,    setProgress]    = useState(0);
  const [stageIndex,  setStageIndex]  = useState(0);
  const [visibleLogs, setVisibleLogs] = useState(0);
  const [exiting,     setExiting]     = useState(false);

  // ── Animate progress 0 → 100 over ~3.6 s ───────────────
  useEffect(() => {
    const interval = 30;
    const step     = (100 / 3600) * interval;
    let current    = 0;

    const ticker = setInterval(() => {
      current = Math.min(current + step + Math.random() * 0.4, 100);
      setProgress(current);
      setStageIndex(
        Math.min(Math.floor((current / 100) * STAGES.length), STAGES.length - 1)
      );
      if (current >= 100) clearInterval(ticker);
    }, interval);

    return () => clearInterval(ticker);
  }, []);

  // ── Stagger log lines: one every 800 ms ─────────────────
  useEffect(() => {
    if (visibleLogs >= LOGS.length) return;
    const t = setTimeout(() => setVisibleLogs((v) => v + 1), 520);
    return () => clearTimeout(t);
  }, [visibleLogs]);

  // ── Original routing preserved exactly ──────────────────
  useEffect(() => {
    router.prefetch("/results");
  }, [router]);

  // ── Preload aura during analysis, cache in sessionStorage ─
  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function preloadAura() {
      const cacheKey = `${AURA_CACHE_PREFIX}${username}`;
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setDataReady(true);
          return;
        }
      } catch {
        // Ignore sessionStorage access issues.
      }

      try {
        const res = await fetch(`/api/aura?username=${encodeURIComponent(username)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Aura fetch failed");
        const json = await res.json();
        if (!active) return;
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(json));
        } catch {
          // Ignore sessionStorage quota errors.
        }
        setDataReady(true);
      } catch (error) {
        if (!active) return;
        setDataReady(true);
      }
    }

    preloadAura();
    return () => {
      active = false;
      controller.abort();
    };
  }, [username]);

  // ── Exit + route once data is ready, keeping cinematic timing ─
  useEffect(() => {
    if (!dataReady) return;
    const elapsed = Date.now() - startTimeRef.current;
    const exitDelay = Math.max(0, MIN_ROUTE_MS - EXIT_OFFSET_MS - elapsed);
    const routeDelay = Math.max(0, MIN_ROUTE_MS - elapsed);

    const exitTimer = setTimeout(() => setExiting(true), exitDelay);
    const routeTimer = setTimeout(() => {
      router.push(`/results?username=${encodeURIComponent(username)}`);
    }, routeDelay);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(routeTimer);
    };
  }, [dataReady, router, username]);

  // ── Particles (computed once, stable) ───────────────────
  const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
    size:    1.5 + (i % 2),
    left:    `${(i * 41.3) % 100}%`,
    top:     `${(i * 57.7) % 100}%`,
    color:   i % 3 === 0 ? "#22d3ee" : i % 3 === 1 ? "#8b5cf6" : "#fb923c",
    dur:     4 + (i % 4),
    delay:   i * 0.22,
  }));

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.main
          key="analyze"
          className="min-h-screen bg-[#04040a] text-white flex items-center justify-center overflow-hidden relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >

          {/* ── SHIMMER KEYFRAME ──────────────────────────── */}
          <style>{`
            @keyframes shimmer {
              0%   { background-position: 200% center; }
              100% { background-position: -200% center; }
            }
          `}</style>

          {/* ── GRID OVERLAY ─────────────────────────────── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(139,92,246,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.035) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          {/* ── AMBIENT ORBS ─────────────────────────────── */}
          <motion.div
            className="absolute w-[600px] h-[600px] bg-purple-600/[0.14] blur-[130px] rounded-full pointer-events-none"
            animate={{ scale: [1, 1.08, 1], x: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-cyan-500/[0.10] blur-[120px] rounded-full pointer-events-none"
            animate={{ scale: [1, 1.06, 1], y: [0, -16, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute top-1/2 left-3/4 w-[280px] h-[280px] bg-orange-500/[0.07] blur-[100px] rounded-full pointer-events-none"
            animate={{ scale: [1, 1.12, 1], x: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />

          {/* ── FLOATING PARTICLES ───────────────────────── */}
          {PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{ width: p.size, height: p.size, left: p.left, top: p.top, background: p.color, opacity: 0.3 }}
              animate={{ y: [0, -28, 0], opacity: [0.15, 0.4, 0.15] }}
              transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}

          {/* ── SCAN LINE ────────────────────────────────── */}
          <motion.div
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.35), transparent)" }}
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />

          {/* ── CONTENT ──────────────────────────────────── */}
          <div className="relative z-10 text-center px-6 flex flex-col items-center gap-10 max-w-3xl mx-auto w-full">

            {/* HERO TEXT */}
            <div className="space-y-5">

              {/* Live label */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2.5"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                </span>
                <p className="uppercase tracking-[0.3em] text-cyan-400 text-xs font-mono">
                  DevAura AI Engine — Active
                </p>
              </motion.div>

              {/* Headline line 1 — clipped rise */}
              <div className="overflow-visible py-3">
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl md:text-7xl font-black leading-[1] tracking-[-0.02em]"
                >
                  Analyzing Your
                </motion.h1>
              </div>

              {/* Headline line 2 — shimmer gradient */}
              <div className="overflow-visible pb-2">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl md:text-7xl font-black leading-[1.08] tracking-[-0.015em] pb-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-orange-400 bg-clip-text text-transparent"
                  style={{ backgroundSize: "200% auto", animation: "shimmer 4s linear infinite" }}
                >
                  Developer Aura
                </motion.div>
              </div>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="text-white/40 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-mono"
              >
                Processing reading habits, stack patterns, learning velocity,
                and archetype resonance across the ecosystem.
              </motion.p>
            </div>

            {/* PROGRESS BAR */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md space-y-3"
            >
              {/* Track */}
              <div className="relative w-full h-[5px] bg-white/[0.06] rounded-full overflow-hidden border border-white/[0.04]">
                {/* Filled bar */}
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #8b5cf6, #22d3ee, #fb923c)",
                    backgroundSize: "200% auto",
                    animation: "shimmer 2s linear infinite",
                  }}
                />
                {/* Glow head */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full blur-sm bg-cyan-400"
                  style={{
                    left: `calc(${progress}% - 6px)`,
                    opacity: progress > 2 ? 0.8 : 0,
                  }}
                />
              </div>

              {/* Stage label + live counter */}
              <div className="flex items-center justify-between font-mono text-xs">
                <motion.span
                  key={stageIndex}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-white/35"
                >
                  {STAGES[stageIndex]}
                </motion.span>
                <span className="text-white/50 tabular-nums">
                  {Math.floor(progress)}%
                </span>
              </div>
            </motion.div>

            {/* AI LOG TERMINAL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl"
            >
              <div className="relative text-left bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 backdrop-blur-xl overflow-hidden">

                {/* Terminal chrome */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.05]">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  <span className="ml-2 text-white/20 text-xs font-mono tracking-widest uppercase">
                    aura-engine · scan.log
                  </span>
                </div>

                {/* Staggered log lines */}
                <div className="space-y-2.5 font-mono text-sm min-h-[96px]">
                  {LOGS.map((log, i) => (
                    <AnimatePresence key={i}>
                      {visibleLogs > i && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className={`flex items-center gap-2.5 ${log.color}`}
                        >
                          <span className="opacity-60 select-none">{log.symbol}</span>
                          <span>{log.text}</span>
                          {/* Blinking cursor on last visible line */}
                          {i === visibleLogs - 1 && visibleLogs < LOGS.length && (
                            <motion.span
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                              className="text-cyan-400"
                            >
                              ▋
                            </motion.span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ))}
                </div>

                {/* Inner glow builds when progress > 80 % */}
                {progress > 80 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 100%, rgba(34,211,238,0.06), transparent 70%)",
                    }}
                  />
                )}
              </div>
            </motion.div>

          </div>
          {/* ── END CONTENT ──────────────────────────────── */}

        </motion.main>
      )}
    </AnimatePresence>
  );
}