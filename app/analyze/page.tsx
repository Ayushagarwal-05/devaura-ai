"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const AURA_CACHE_PREFIX  = "devaura:aura:";
const MIN_DISPLAY_MS     = 5200;  // minimum cinematic duration
const EXIT_ANIM_MS       = 300;   // exit animation duration
const POST_COMPLETE_MS   = 350;   // pause at 100% before exit starts

function getUsernameFromSearch() {
  if (typeof window === "undefined") return "ayu_buildss";
  const params = new URLSearchParams(window.location.search);
  return params.get("username") || "ayu_buildss";
}

// ─── EASING ───────────────────────────────────────────────────────────────────
// Smooth acceleration + deceleration. Maps 0–1 → 0–1.
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ─── LOG LINES ────────────────────────────────────────────────────────────────
const LOGS = [
  { symbol: "✓", text: "Parsing reading behavior...",          color: "text-zinc-400" },
  { symbol: "✓", text: "Mapping tech stack affinity...",       color: "text-zinc-400" },
  { symbol: "✓", text: "Detecting open-source resonance...",   color: "text-zinc-400" },
  { symbol: "✓", text: "Calculating learning velocity...",     color: "text-zinc-400" },
  { symbol: "✓", text: "Analyzing engineering depth...",       color: "text-zinc-400" },
  { symbol: "✓", text: "Estimating creativity index...",       color: "text-zinc-400" },
  { symbol: "✓", text: "Mapping architecture preference...",   color: "text-zinc-400" },
  { symbol: "✓", text: "Detecting builder archetype...",       color: "text-zinc-400" },
  { symbol: "✓", text: "Generating aura signature...",         color: "text-zinc-400" },
  { symbol: "→", text: "Finalizing cinematic identity...",     color: "text-cyan-400"  },
];

const STAGES = [
  "Initializing signal scan...",
  "Mapping ecosystem signals...",
  "Detecting archetype alignment...",
  "Generating identity card...",
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function AnalyzePage() {
  const router     = useRouter();
  const [username] = useState(getUsernameFromSearch);

  // ── Visual state ──────────────────────────────────────────
  const [progress,    setProgress]    = useState(0);
  const [stageIndex,  setStageIndex]  = useState(0);
  const [visibleLogs, setVisibleLogs] = useState(0);
  const [exiting,     setExiting]     = useState(false);

  // ── Timing refs — mutations never cause re-renders ───────
  const rafRef        = useRef<number>(0);
  const startRef      = useRef<number>(0);
  const totalDurRef   = useRef<number>(MIN_DISPLAY_MS);
  const completeRef   = useRef<boolean>(false);

  // ── rAF progress loop ────────────────────────────────────
  // Progress is a pure function of elapsed / totalDuration.
  // Logs are revealed as progress crosses each threshold —
  // progress drives logs, never the other way around.
  useEffect(() => {
    startRef.current = performance.now();

    function tick(now: number) {
      const elapsed  = now - startRef.current;
      const duration = totalDurRef.current;
      const raw      = Math.min(elapsed / duration, 1);
      const eased    = easeInOutCubic(raw);
      const pct      = eased * 100;

      setProgress(pct);

      // Reveal log N the moment progress crosses its threshold.
      // The -1 offset prevents the final log needing exact 100%.
      const newVisible = LOGS.filter(
        (_, i) => pct >= ((i + 1) / LOGS.length) * 100 - 1
      ).length;
      setVisibleLogs(newVisible);

      // Advance stage label
      setStageIndex(
        Math.min(Math.floor(raw * STAGES.length), STAGES.length - 1)
      );

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // ── Reached 100% — guaranteed exit sequence ──────
        if (!completeRef.current) {
          completeRef.current = true;
          setProgress(100);
          setVisibleLogs(LOGS.length);
          setStageIndex(STAGES.length - 1);

          setTimeout(() => setExiting(true), POST_COMPLETE_MS);
          setTimeout(
            () => router.push(`/results?username=${encodeURIComponent(username)}`),
            POST_COMPLETE_MS + EXIT_ANIM_MS
          );
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── API prefetch + cache in sessionStorage ───────────────
  // Stretches totalDurRef if the API is slower than MIN_DISPLAY_MS
  // so the bar always finishes in sync with real data — no fake gaps.
  useEffect(() => {
    router.prefetch("/results");

    let active       = true;
    const controller = new AbortController();

    async function preloadAura() {
      const cacheKey = `${AURA_CACHE_PREFIX}${username}`;

      // Already cached — no stretch needed
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) return;
      } catch { /* ignore */ }

      try {
        const res = await fetch(
          `/api/aura?username=${encodeURIComponent(username)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Aura fetch failed");
        const json = await res.json();
        if (!active) return;

        try { sessionStorage.setItem(cacheKey, JSON.stringify(json)); }
        catch { /* quota */ }

        // If API took longer than MIN_DISPLAY_MS, stretch the animation
        // window so the bar finishes exactly when data is ready (+400ms buffer).
        const elapsed = performance.now() - startRef.current;
        if (elapsed + 400 > totalDurRef.current) {
          totalDurRef.current = elapsed + 400;
        }
      } catch {
        // On error let the animation complete normally — results page
        // handles the missing data gracefully.
      }
    }

    preloadAura();
    return () => { active = false; controller.abort(); };
  }, [router, username]);

  // ── Particles (stable, computed once) ────────────────────
  const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
    size:  1.5 + (i % 2),
    left:  `${(i * 41.3) % 100}%`,
    top:   `${(i * 57.7) % 100}%`,
    color: i % 3 === 0 ? "#22d3ee" : i % 3 === 1 ? "#8b5cf6" : "#fb923c",
    dur:   4 + (i % 4),
    delay: i * 0.22,
  }));

  // ─── JSX — all UI/design completely unchanged ─────────────────────────────
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

                {/* Inner glow builds when progress > 80% */}
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