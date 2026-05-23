"use client";

import { domToPng } from "modern-screenshot";
import { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── CACHE / URL HELPERS (UNCHANGED) ─────────────────────────────────────────
const AURA_CACHE_PREFIX = "devaura:aura:";

function getUsernameFromSearch() {
  if (typeof window === "undefined") return "ayu_buildss";
  const params = new URLSearchParams(window.location.search);
  return params.get("username") || "ayu_buildss";
}

// ─── EASE ─────────────────────────────────────────────────────────────────────
const E = [0.16, 1, 0.3, 1] as const;

// ─── FLOATING PARTICLES ───────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  w:     0.8 + (i % 3) * 0.7,
  left:  `${(i * 37.9) % 100}%`,
  top:   `${(i * 61.3) % 100}%`,
  color: i % 3 === 0 ? "#22d3ee" : i % 3 === 1 ? "#8b5cf6" : "#fb923c",
  dur:   4 + (i % 5),
  delay: i * 0.2,
}));

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────
function Counter({ to, duration = 1.4 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref           = useRef<HTMLSpanElement>(null);
  const inView        = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start     = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration]);

  return <span ref={ref}>{val}</span>;
}

// ─── STRENGTH TAG ────────────────────────────────────────────────────────────
function StrengthTag({ text, index }: { text: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 + index * 0.12, duration: 0.55, ease: E }}
      whileHover={{ scale: 1.02, x: 4 }}
      className="group relative flex items-center gap-3 px-5 py-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.06] overflow-hidden cursor-default"
    >
      {/* hover shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
      {/* dot */}
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" style={{ boxShadow: "0 0 6px #22d3ee" }} />
      <span className="text-cyan-200 text-sm font-medium break-words relative z-10">{text}</span>
    </motion.div>
  );
}

// ─── SCAN LINE ────────────────────────────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none z-50"
      style={{ background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.4) 50%, transparent 100%)" }}
      initial={{ top: "0%" }}
      animate={{ top: "100%" }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ─── ARCHETYPE BADGE ─────────────────────────────────────────────────────────
function ArchetypeBadge({ archetype }: { archetype: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8, ease: E }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
      </span>
      <span className="text-cyan-400 text-xs font-mono tracking-[0.25em] uppercase">AI Aura Prediction</span>
    </motion.div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  color,
  delay,
  suffix = "",
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
  suffix?: string;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: E }}
      whileHover={{ scale: 1.03, y: -2 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] px-6 py-5 cursor-default"
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}18, transparent 70%)` }} />
      <p className="text-white/35 text-xs font-mono uppercase tracking-widest mb-2">{label}</p>
      <h3 className="text-4xl md:text-5xl font-black tabular-nums" style={{ color }}>
        {inView ? <Counter to={value} /> : 0}{suffix}
      </h3>
    </motion.div>
  );
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
      <span className="text-white/25 text-[10px] font-mono uppercase tracking-[0.3em]">{children}</span>
      <div className="h-px flex-1 bg-gradient-to-l from-white/[0.06] to-transparent" />
    </div>
  );
}

// ─── INFO BLOCK ──────────────────────────────────────────────────────────────
function InfoBlock({
  label,
  children,
  delay,
}: {
  label: string;
  children: React.ReactNode;
  delay: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: E }}
      className="group relative p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/[0.03] transition-all duration-500" />
      <p className="text-white/25 text-[10px] font-mono uppercase tracking-[0.28em] mb-3">{label}</p>
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function ResultsPage() {
  // ── ALL ORIGINAL LOGIC PRESERVED EXACTLY ────────────────
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

  // ── LOADING STATE — upgraded from blank black ────────────
  if (!data) {
    return (
      <main className="min-h-screen bg-[#04040a] flex items-center justify-center relative overflow-hidden">
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10 text-center space-y-4">
          <motion.div
            className="text-2xl font-black tracking-[-0.02em] bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Reading Your Aura...
          </motion.div>
          <div className="w-48 h-1 bg-white/[0.05] rounded-full overflow-hidden mx-auto">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </main>
    );
  }
  // ── END LOADING ──────────────────────────────────────────

  const profile = data.profile;
  const aura    = data.aura;

  return (
    <motion.main
      id="aura-card"
      className="min-h-screen bg-[#04040a] text-white px-4 sm:px-6 py-16 relative overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* ── KEYFRAMES ──────────────────────────────────── */}
      <style>{`
        @keyframes shimmer-lr {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin-rev {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }
      `}</style>

      {/* ── BACKGROUND ────────────────────────────────── */}
      {/* Grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* Orbs */}
      <motion.div
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none rounded-full"
        style={{ width: 900, height: 600, background: "radial-gradient(ellipse, rgba(139,92,246,0.10) 0%, transparent 65%)" }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed top-0 right-0 pointer-events-none rounded-full"
        style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)" }}
        animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed bottom-0 left-0 pointer-events-none rounded-full"
        style={{ width: 450, height: 450, background: "radial-gradient(circle, rgba(251,146,60,0.07) 0%, transparent 70%)" }}
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ width: p.w, height: p.w, left: p.left, top: p.top, background: p.color }}
            animate={{ y: [0, -40, 0], opacity: [0.08, 0.35, 0.08] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
      {/* Scan line */}
      <ScanLine />

      {/* ═══════════════════════════════════════════════
          CONTENT
      ═══════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── HEADER ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: E }}
          className="text-center mb-16 sm:mb-20"
        >
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: E }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm mb-6"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="text-white/40 text-xs font-mono tracking-widest uppercase">
              Identity Decoded · {username}
            </span>
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-3">
            <motion.h1
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.9, ease: E }}
              className="text-5xl md:text-7xl font-extrabold tracking-[-0.02em] leading-[1.05] pb-2"
            >
              <span className="text-white">Developer</span>{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #8b5cf6 0%, #22d3ee 50%, #fb923c 100%)",
                  backgroundSize: "200% auto",
                  animation: "shimmer-lr 5s linear infinite",
                }}
              >
                Aura
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-white/35 text-sm font-mono tracking-widest uppercase"
          >
            AI-generated identity analysis
          </motion.p>
        </motion.div>

        {/* ═══ MAIN 2-COL GRID ═══ */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">

          {/* ────────────────────────────────────────────
              LEFT CARD — Profile + Stats + Strengths
          ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1, ease: E }}
            className="relative rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl overflow-hidden"
          >
            {/* Card inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.04] via-transparent to-violet-500/[0.04] pointer-events-none" />
            {/* Top edge accent */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

            <div className="relative z-10 p-6 md:p-8">

              {/* Profile row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                {/* Avatar with orbital ring */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.7, type: "spring", stiffness: 180 }}
                  className="relative shrink-0"
                >
                  {/* Spin ring */}
                  <div
                    className="absolute -inset-2 rounded-full border border-dashed border-cyan-500/25"
                    style={{ animation: "spin-slow 12s linear infinite" }}
                  />
                  <div
                    className="absolute -inset-4 rounded-full border border-dotted border-violet-500/15"
                    style={{ animation: "spin-rev 18s linear infinite" }}
                  />
                  <img
                    src={profile.image}
                    alt="profile"
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-cyan-400/50 relative z-10"
                    style={{ boxShadow: "0 0 30px rgba(34,211,238,0.3), 0 0 60px rgba(34,211,238,0.1)" }}
                  />
                  {/* Online dot */}
                  <div className="absolute bottom-0.5 right-0.5 z-20 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#04040a]" />
                </motion.div>

                {/* Name / handle */}
                <div className="min-w-0 flex-1">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: E }}
                    className="text-3xl md:text-4xl font-black tracking-[-0.03em] text-white break-words leading-tight"
                  >
                    {profile.name}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-cyan-400 text-lg font-mono mt-1 break-all"
                  >
                    @{profile.username}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-white/35 text-sm mt-2 font-mono"
                  >
                    {aura.vibe}
                  </motion.p>
                </div>
              </div>

              {/* Bio */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="mb-8"
              >
                <SectionLabel>Bio</SectionLabel>
                <p className="text-white/55 text-sm sm:text-base leading-relaxed">{profile.bio}</p>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <StatCard label="Reputation"  value={Number(profile.reputation)} color="#a78bfa" delay={0.5} />
                <StatCard label="Aura Score"  value={Math.min(aura.auraScore, 100)}        color="#22d3ee" delay={0.6} />
              </div>

              {/* Strengths */}
              <div>
                <SectionLabel>Strength Matrix</SectionLabel>
                <div className="flex flex-col gap-2.5">
                  {aura.strengths.map((strength: string, index: number) => (
                    <StrengthTag key={index} text={strength} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ────────────────────────────────────────────
              RIGHT CARD — Archetype + Insights + CTA
          ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: E }}
            className="relative rounded-3xl border border-white/[0.08] overflow-hidden"
            style={{ background: "radial-gradient(ellipse at 30% 0%, rgba(139,92,246,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(34,211,238,0.05) 0%, transparent 55%), rgba(7,7,16,0.95)" }}
          >
            {/* Top edge accent */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
            {/* Corner glow */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />

            <div className="relative z-10 p-6 md:p-8">

              {/* Archetype badge + name */}
              <div className="mb-8">
                <ArchetypeBadge archetype={aura.archetype} />

                <div className="overflow-visible py-3">
                  <motion.h2
                    initial={{ y: 70, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.9, ease: E }}
                    className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.88] tracking-[-0.04em] break-words"
                    style={{
                      backgroundImage: "linear-gradient(135deg, #fff 40%, rgba(139,92,246,0.8) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {aura.archetype}
                  </motion.h2>
                </div>
              </div>

              {/* Personality summary */}
              <div className="space-y-5 mb-8">
                <InfoBlock label="Personality Summary" delay={0.45}>
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed">{aura.summary}</p>
                </InfoBlock>

                <InfoBlock label="Future Prediction" delay={0.55}>
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed">{aura.futurePrediction}</p>
                </InfoBlock>
              </div>

              {/* Aura score ring display */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6, ease: E }}
                className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] mb-6"
              >
                {/* Mini ring */}
                <div className="relative w-14 h-14 shrink-0">
                  <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                    <motion.circle
                      cx="28" cy="28" r="22"
                      fill="none"
                      stroke="url(#scoreGrad)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 22}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 22 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 22 * (1 - Math.min(aura.auraScore, 100) / 100) }}
                      transition={{ delay: 0.8, duration: 1.6, ease: E }}
                    />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-black text-white/80">{Math.min(aura.auraScore, 100)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-white/60 text-sm font-medium">Overall Aura Score</p>
                  <p className="text-white/30 text-xs font-mono mt-0.5">Top {Math.max(1, 100 - Math.min(aura.auraScore, 100) + 3)}% of analyzed developers</p>
                </div>
              </motion.div>

              {/* ACTION BUTTONS — all original handlers preserved */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6, ease: E }}
                className="flex gap-3 capture-hide"
              >
                {/* Share */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `I got "${aura.archetype}" on DevAura AI 🔥`
                    );
                    alert("Aura copied to clipboard!");
                  }}
                  className="group relative flex-1 py-4 rounded-2xl overflow-hidden font-bold text-base text-black"
                  style={{ background: "linear-gradient(135deg, #22d3ee, #8b5cf6)" }}
                >
                  {/* shimmer sweep */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">Share Aura</span>
                </motion.button>

                {/* Download — original handler 100% preserved */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={async () => {
                    const hidden = document.querySelectorAll(".capture-hide");
                    hidden.forEach((el) => { (el as HTMLElement).style.display = "none"; });

                    const element = document.getElementById("aura-card");
                    if (!element) return;

                    const dataUrl = await domToPng(element, {
                      width:   element.scrollWidth,
                      height:  element.scrollHeight,
                      bgcolor: "#000000",
                    });

                    hidden.forEach((el) => { (el as HTMLElement).style.display = "flex"; });

                    const link      = document.createElement("a");
                    link.download   = `${profile.username}-aura.png`;
                    link.href       = dataUrl;
                    link.click();
                  }}
                  className="flex-1 py-4 rounded-2xl border border-white/[0.1] bg-white/[0.03] text-white/70 font-bold text-base hover:bg-white/[0.07] hover:border-white/[0.18] hover:text-white transition-all duration-300"
                >
                  Download
                </motion.button>
              </motion.div>

            </div>
          </motion.div>
          {/* ── END RIGHT ── */}

        </div>
        {/* ── END GRID ── */}

        {/* ── FOOTER STRIP ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-10 flex items-center justify-center gap-2 capture-hide"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          <span className="text-white/20 text-xs font-mono tracking-widest uppercase">
            DevAura AI · Powered by daily.dev
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
        </motion.div>

      </div>
    </motion.main>
  );
}