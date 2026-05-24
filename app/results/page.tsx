"use client";

import { domToPng } from "modern-screenshot";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, TrendingUp, Share2, Download } from "lucide-react";

// ─── CACHE / URL HELPERS — UNCHANGED ─────────────────────────────────────────
const AURA_CACHE_PREFIX = "devaura:aura:";

function getUsernameFromSearch() {
  if (typeof window === "undefined") return "ayu_buildss";
  const params = new URLSearchParams(window.location.search);
  return params.get("username") || "ayu_buildss";
}

// ─── EASE ─────────────────────────────────────────────────────────────────────
const E = [0.16, 1, 0.3, 1] as const;

// ─── PARTICLES ────────────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  w:     0.8 + (i % 3) * 0.6,
  left:  `${(i * 37.9) % 100}%`,
  top:   `${(i * 61.3) % 100}%`,
  color: i % 3 === 0 ? "#22d3ee" : i % 3 === 1 ? "#8b5cf6" : "#fb923c",
  dur:   4 + (i % 5),
  delay: i * 0.2,
}));

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function Counter({ to, duration = 1.2 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref    = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick  = (now: number) => {
      const p     = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration]);
  return <span ref={ref}>{val}</span>;
}

// ─── SCAN LINE ────────────────────────────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="fixed left-0 right-0 h-px pointer-events-none z-0"
      style={{ background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.5) 50%, transparent 100%)" }}
      initial={{ top: "0%" }}
      animate={{ top: "100%" }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ─── AURA RING ────────────────────────────────────────────────────────────────
// Exported version: static (no animation), so the ring is always drawn at
// full progress in the PNG — animation is only for the live page.
function AuraRing({ score, isExport = false }: { score: number; isExport?: boolean }) {
  const r    = 28;
  const circ = 2 * Math.PI * r;
  const ref  = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const offset = circ * (1 - Math.min(score, 100) / 100);

  return (
    <div ref={ref} className="relative shrink-0" style={{ width: 72, height: 72 }}>
      <svg viewBox="0 0 72 72" width="72" height="72" className="-rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        {isExport ? (
          // Static circle for export — always fully drawn
          <circle
            cx="36" cy="36" r={r}
            fill="none"
            stroke="url(#ringGradExport)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
          />
        ) : (
          <motion.circle
            cx="36" cy="36" r={r}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={inView ? { strokeDashoffset: offset } : {}}
            transition={{ delay: 0.6, duration: 1.6, ease: E }}
          />
        )}
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#8b5cf6" />
            <stop offset="50%"  stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
          <linearGradient id="ringGradExport" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#8b5cf6" />
            <stop offset="50%"  stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-black text-white leading-none tabular-nums">
          {Math.min(score, 100)}
        </span>
        <span className="font-mono text-white/30 uppercase tracking-wider mt-0.5" style={{ fontSize: 9 }}>Aura</span>
      </div>
    </div>
  );
}

// ─── CARD INNER — used for both live UI and PNG export ────────────────────────
// Accepts `isExport` so animations/motion props are stripped for the snapshot.
function CardInner({
  profile,
  aura,
  score,
  isExport = false,
}: {
  profile: any;
  aura: any;
  score: number;
  isExport?: boolean;
}) {
  const wrap = (content: React.ReactNode, delay: number, extraClass = "") => {
    if (isExport) return <div className={extraClass}>{content}</div>;
    return (
      <motion.div
        className={extraClass}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.55, ease: E }}
      >
        {content}
      </motion.div>
    );
  };

  return (
    <div
      style={{
        background: "linear-gradient(145deg, rgba(13,13,26,0.99) 0%, rgba(7,7,18,1) 100%)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
        boxShadow: isExport
          ? "none"
          : "0 0 0 1px rgba(139,92,246,0.1), 0 40px 100px rgba(0,0,0,0.7), 0 0 80px rgba(139,92,246,0.07)",
      }}
    >
      {/* Top accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.7), transparent)",
      }} />
      {/* Corner glow TR */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: 200, height: 160, pointerEvents: "none",
        background: "radial-gradient(circle at 90% 0%, rgba(139,92,246,0.16) 0%, transparent 70%)",
      }} />
      {/* Corner glow BL */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, width: 160, height: 160, pointerEvents: "none",
        background: "radial-gradient(circle at 0% 100%, rgba(34,211,238,0.10) 0%, transparent 70%)",
      }} />

      {/* ── HEADER BAR ─────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 24px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: "#8b5cf6",
            boxShadow: "0 0 8px #8b5cf6",
          }} />
          <span style={{
            fontFamily: "monospace", fontSize: 10, color: "rgba(139,92,246,0.85)",
            letterSpacing: "0.3em", textTransform: "uppercase",
          }}>DevAura AI</span>
        </div>
        <span style={{
          fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.15)",
          letterSpacing: "0.2em",
        }}>identity.v1</span>
      </div>

      {/* ── PROFILE ROW ────────────────────────────── */}
      <div style={{ padding: "20px 24px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            {/* Dashed spin ring — only on live, skip for export (CSS animation doesn't capture) */}
            {!isExport && (
              <>
                <div className="absolute -inset-2 rounded-full border border-dashed border-cyan-500/20"
                  style={{ animation: "spin-slow 14s linear infinite" }} />
                <div className="absolute -inset-3.5 rounded-full border border-dotted border-violet-500/10"
                  style={{ animation: "spin-rev 20s linear infinite" }} />
              </>
            )}
            <img
              src={profile.image}
              alt={profile.name}
              style={{
                width: 56, height: 56, borderRadius: 14, objectFit: "cover",
                border: "1.5px solid rgba(34,211,238,0.35)",
                boxShadow: "0 0 20px rgba(34,211,238,0.3), 0 0 50px rgba(34,211,238,0.08)",
                display: "block", position: "relative", zIndex: 1,
              }}
            />
            {/* Online dot */}
            <div style={{
              position: "absolute", bottom: -2, right: -2, zIndex: 2,
              width: 12, height: 12, borderRadius: "50%", background: "#10b981",
              border: "2px solid #05050a",
            }} />
          </div>

          {/* Name + handle */}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontSize: 24, fontWeight: 900, color: "#fff",
              letterSpacing: "-0.025em", lineHeight: 1.15,
              wordBreak: "break-word",
            }}>{profile.name}</div>
            <div style={{
              fontFamily: "monospace", fontSize: 13, color: "#22d3ee",
              marginTop: 3, wordBreak: "break-all",
            }}>@{profile.username} · daily.dev</div>
            {aura.vibe && (
              <div style={{
                fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.32)",
                marginTop: 2,
              }}>{aura.vibe}</div>
            )}
          </div>

          {/* Aura ring */}
          <AuraRing score={score} isExport={isExport} />
        </div>
      </div>

      {/* Divider */}
      <div style={{ margin: "0 24px", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)" }} />

      {/* ── ARCHETYPE ──────────────────────────────── */}
      {wrap(
        <div style={{
          borderRadius: 14, overflow: "hidden", position: "relative",
          background: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(34,211,238,0.05) 100%)",
          border: "1px solid rgba(139,92,246,0.25)",
          padding: "14px 16px",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, rgba(139,92,246,0.06), transparent)",
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "rgba(139,92,246,0.75)" }}>✦</span>
              <span style={{
                fontFamily: "monospace", fontSize: 9, color: "rgba(139,92,246,0.7)",
                letterSpacing: "0.32em", textTransform: "uppercase",
              }}>Archetype</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              {aura.archetype}
            </div>
            {aura.vibe && (
              <div style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
                {aura.vibe} · Tier I
              </div>
            )}
          </div>
        </div>,
        0.34, "px-6 py-4" // only used in live view
      )}

      {/* Divider */}
      <div style={{ margin: "0 24px", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)" }} />

      {/* ── METRICS ────────────────────────────────── */}
      {wrap(
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "Reputation", value: Number(profile.reputation), color: "#a78bfa" },
            { label: "Aura Score", value: score,                       color: "#22d3ee" },
            { label: "Strengths",  value: aura.strengths?.length ?? 0, color: "#fb923c" },
          ].map((m) => (
            <div key={m.label} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "14px 8px",
              borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.03)",
            }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: m.color, fontVariantNumeric: "tabular-nums" }}>
                {m.value}
              </span>
              <span style={{
                fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.28)",
                textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 3,
              }}>{m.label}</span>
            </div>
          ))}
        </div>,
        0.42, "px-6 py-4"
      )}

      {/* Divider */}
      <div style={{ margin: "0 24px", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)" }} />

      {/* ── STRENGTHS ──────────────────────────────── */}
      {aura.strengths?.length > 0 && wrap(
        <>
          <div style={{
            fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase", letterSpacing: "0.3em", marginBottom: 10,
          }}>Strength Matrix</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {aura.strengths.map((s: string, i: number) => (
              <span key={i} style={{
                padding: "7px 14px", borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.09)",
                background: "rgba(255,255,255,0.04)",
                fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.55)",
              }}>{s}</span>
            ))}
          </div>
        </>,
        0.50, "px-6 py-4"
      )}

      {/* Divider */}
      <div style={{ margin: "0 24px", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)" }} />

      {/* ── PERSONALITY SUMMARY ────────────────────── */}
      {wrap(
        <>
          <div style={{
            fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase", letterSpacing: "0.3em", marginBottom: 8,
          }}>Personality Summary</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.62)", lineHeight: 1.65 }}>
            {aura.summary}
          </div>
        </>,
        0.56, "px-6 py-4"
      )}

      {/* Divider */}
      <div style={{ margin: "0 24px", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)" }} />

      {/* ── AI PREDICTION ──────────────────────────── */}
      {wrap(
        <div style={{
          borderRadius: 14, overflow: "hidden",
          background: "linear-gradient(135deg, rgba(34,211,238,0.07) 0%, rgba(139,92,246,0.05) 100%)",
          border: "1px solid rgba(34,211,238,0.20)",
          padding: "14px 16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "#22d3ee", opacity: 0.8 }}>↗</span>
            <span style={{
              fontFamily: "monospace", fontSize: 9, color: "rgba(34,211,238,0.65)",
              letterSpacing: "0.3em", textTransform: "uppercase",
            }}>AI Prediction</span>
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>
            {aura.futurePrediction}
          </div>
        </div>,
        0.64, "px-6 py-4"
      )}

      {/* ── BIO ────────────────────────────────────── */}
      {profile.bio && (
        <>
          <div style={{ margin: "0 24px", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)" }} />
          {wrap(
            <>
              <div style={{
                fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.18)",
                textTransform: "uppercase", letterSpacing: "0.3em", marginBottom: 6,
              }}>Bio</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.40)", lineHeight: 1.6 }}>
                {profile.bio}
              </div>
            </>,
            0.70, "px-6 py-4"
          )}
        </>
      )}

      {/* ── CARD FOOTER ────────────────────────────── */}
      <div style={{ margin: "0 24px", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)" }} />
      <div style={{
        padding: "12px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{
          fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.1)",
          textTransform: "uppercase", letterSpacing: "0.3em",
        }}>DEVAURA·IDENTITY</span>
        <div style={{ display: "flex", gap: 5 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: "50%",
              background: i < 4 ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.08)",
            }} />
          ))}
        </div>
      </div>
      {/* Bottom accent line */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.3), transparent)" }} />
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function ResultsPage() {

  // ── ALL ORIGINAL LOGIC — UNCHANGED ───────────────────────
  const [username] = useState(getUsernameFromSearch);
  const [data, setData] = useState<any>(() => {
    if (typeof window === "undefined") return null;
    const cacheKey = `${AURA_CACHE_PREFIX}${getUsernameFromSearch()}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (data) return;
    let active = true;
    const controller = new AbortController();

    async function loadAura() {
      if (username === "ayu_buildss") {
        setData({
          profile: {
            name: "Ayush Agarwal", username: "ayu_buildss",
            bio: "AI builder crafting futuristic developer experiences.",
            reputation: 355,
            image: "https://avatars.githubusercontent.com/u/183745432?v=4&size=512",
          },
          aura: {
            archetype: "Innovative Problem Solver",
            summary: "A highly creative builder who combines engineering with cinematic product thinking.",
            strengths: ["AI Product Thinking", "Frontend Experience Design", "Rapid MVP Building"],
            futurePrediction: "Likely to evolve into a strong AI product engineer focused on immersive developer tools.",
            auraScore: 88,
            vibe: "Cinematic AI Builder",
          },
        });
        return;
      }
      const res = await fetch(`/api/aura?username=${encodeURIComponent(username)}`, { signal: controller.signal });
      if (!res.ok) return;
      const json = await res.json();
      if (!active) return;
      try { sessionStorage.setItem(`${AURA_CACHE_PREFIX}${username}`, JSON.stringify(json)); } catch {}
      setData(json);
    }

    loadAura();
    return () => { active = false; controller.abort(); };
  }, [data, username]);

  

  const profile = data?.profile;
  const aura    = data?.aura;
  const score   = Math.min(aura?.auraScore ?? 0, 100);

  // ── SHARE HANDLER — UNCHANGED ────────────────────────────
  const handleShare = () => {
    navigator.clipboard.writeText(
      `My DevAura identity: ${aura.archetype} ⚡

  ${aura.summary}

  Aura Score: ${score}

  Analyze yours → https://devaura-ai-2mx4.vercel.app/`
    );

    alert("DevAura identity copied.");
  };

  // ── DOWNLOAD HANDLER — REBUILT ────────────────────────────
  // Strategy:
  //   1. Build a fully off-screen, static clone of the card in a hidden div.
  //      The clone uses inline styles (no Tailwind/animation), so domToPng
  //      captures exactly what we compose — no layout shift, no blurry text.
  //   2. Inject it into the real DOM briefly (domToPng needs it mounted),
  //      capture at 2× pixel ratio, then remove it.
  //   3. No scale transform tricks — those cause the distortion in the original.
  const handleDownload = useCallback(async () => {
    // Create a container that's off-screen but has a fixed known width
    const CARD_WIDTH = 620; // px — the exact export width

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      position: fixed;
      top: -9999px;
      left: -9999px;
      width: ${CARD_WIDTH}px;
      background: #05050a;
      padding: 32px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      -webkit-font-smoothing: antialiased;
    `;
    document.body.appendChild(wrapper);

    // Render the static card clone into the wrapper
    const { createRoot } = await import("react-dom/client");
    const root = createRoot(wrapper);

    await new Promise<void>((resolve) => {
      root.render(
        <CardInner profile={profile} aura={aura} score={score} isExport={true} />
      );
      // Give React one tick to flush the render
      setTimeout(resolve, 120);
    });

    try {
      const dataUrl = await domToPng(wrapper, {
        scale: 2,           // 2× = crisp on retina without distortion
        quality: 1,
      });

      const link    = document.createElement("a");
      link.download = `${profile.username}-aura.png`;
      link.href     = dataUrl;
      link.click();
    } finally {
      root.unmount();
      document.body.removeChild(wrapper);
    }
  }, [profile, aura, score]);
  if (!data) return null;
  return (
    <motion.main
      className="min-h-screen bg-[#05050a] text-white relative overflow-x-hidden flex flex-col items-center justify-start py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ── KEYFRAMES ──────────────────────────────────── */}
      <style>{`
        @keyframes spin-slow  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
        @keyframes spin-rev   { from { transform: rotate(360deg); } to { transform: rotate(0deg);    } }
      `}</style>

      {/* ── FIXED BACKGROUND ───────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute rounded-full blur-[120px] opacity-20"
          style={{ width: 800, height: 600, top: "-10%", left: "50%", translateX: "-50%", background: "#8b5cf6" }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div className="absolute rounded-full blur-[120px] opacity-15"
          style={{ width: 500, height: 500, top: "40%", right: "-10%", background: "#22d3ee" }}
          animate={{ y: [0, -24, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div className="absolute rounded-full blur-[120px] opacity-10"
          style={{ width: 400, height: 400, bottom: "-5%", left: "-5%", background: "#fb923c" }}
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        {PARTICLES.map((p, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ width: p.w, height: p.w, left: p.left, top: p.top, background: p.color }}
            animate={{ y: [0, -36, 0], opacity: [0.07, 0.3, 0.07] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
      <ScanLine />

      {/* ═══════════════════════════════════════════════════════
          LAYOUT
      ═══════════════════════════════════════════════════════ */}
      <div className="relative z-20 w-full mx-auto flex flex-col gap-4" style={{ maxWidth: 620 }}>

        {/* ── EYEBROW ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: E }}
          className="flex items-center justify-between px-1"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="text-white/30 text-[10px] font-mono tracking-[0.3em] uppercase">
              Identity Decoded · {username}
            </span>
          </div>
        </motion.div>

        {/* ── LIVE CARD ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, ease: E }}
        >
          {/* Holographic sweep — live only */}
          <div className="relative" style={{ borderRadius: 20, overflow: "hidden" }}>
            <motion.div
              className="absolute inset-y-0 w-1/4 pointer-events-none z-10"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)" }}
              initial={{ x: "-150%", skewX: -15 }}
              animate={{ x: "600%" }}
              transition={{ delay: 0.9, duration: 1.2, ease: "easeInOut" }}
            />
            <CardInner profile={profile} aura={aura} score={score} isExport={false} />
          </div>
        </motion.div>

        {/* ── ACTION BUTTONS ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82, duration: 0.5, ease: E }}
          className="flex gap-3 capture-hide"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            className="group relative flex-1 flex items-center justify-center gap-2 py-3 rounded-xl overflow-hidden font-bold text-sm text-black"
            style={{ background: "linear-gradient(135deg, #22d3ee 0%, #8b5cf6 100%)" }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Share2 className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Share Aura</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/[0.1] bg-white/[0.03] text-white/55 font-bold text-sm hover:bg-white/[0.07] hover:border-white/[0.18] hover:text-white transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            Download
          </motion.button>
        </motion.div>

        {/* ── FOOTER ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="flex items-center justify-center gap-2 py-1 capture-hide"
        >
          <div className="w-1 h-1 rounded-full bg-violet-500/40" />
          <span className="text-white/15 text-[10px] font-mono tracking-[0.3em] uppercase">
            DevAura AI · Powered by daily.dev
          </span>
          <div className="w-1 h-1 rounded-full bg-cyan-500/40" />
        </motion.div>

      </div>
    </motion.main>
  );
}