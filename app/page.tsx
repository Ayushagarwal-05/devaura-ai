"use client";

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Zap, Brain, Eye, Layers, TrendingUp, Star, ArrowRight,
  Code2, Cpu, GitBranch, Globe, Shield, Sparkles, ChevronRight,
  Terminal, Flame, Crown, Atom, Compass, BarChart3, Users, Lock
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Archetype {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  glow: string;
  tags: string[];
  aura: number;
}

interface Testimonial {
  name: string;
  handle: string;
  role: string;
  text: string;
  aura: string;
  archetype: string;
  avatar: string;
}

interface Metric {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  percentage: number;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const ARCHETYPES: Archetype[] = [
  {
    icon: <Flame className="w-6 h-6" />,
    title: "The Architect",
    subtitle: "Systems Visionary",
    color: "from-orange-500 to-red-600",
    glow: "shadow-orange-500/30",
    tags: ["Distributed Systems", "Rust", "K8s"],
    aura: 94,
  },
  {
    icon: <Atom className="w-6 h-6" />,
    title: "The Alchemist",
    subtitle: "Full-Stack Transformer",
    color: "from-violet-500 to-purple-700",
    glow: "shadow-violet-500/30",
    tags: ["React", "GraphQL", "AI/ML"],
    aura: 87,
  },
  {
    icon: <Crown className="w-6 h-6" />,
    title: "The Oracle",
    subtitle: "Data Prophet",
    color: "from-cyan-400 to-blue-600",
    glow: "shadow-cyan-400/30",
    tags: ["Python", "LLMs", "Analytics"],
    aura: 91,
  },
  {
    icon: <Compass className="w-6 h-6" />,
    title: "The Pioneer",
    subtitle: "Edge Explorer",
    color: "from-emerald-400 to-teal-600",
    glow: "shadow-emerald-400/30",
    tags: ["WebAssembly", "Edge", "Go"],
    aura: 89,
  },
];

const METRICS: Metric[] = [
  {
    label: "Aura Score",
    value: "94.7",
    icon: <Sparkles className="w-5 h-5" />,
    color: "text-violet-400",
    description: "Overall developer resonance across the ecosystem",
    percentage: 94,
  },
  {
    label: "Tech Velocity",
    value: "87.2",
    icon: <Zap className="w-5 h-5" />,
    color: "text-cyan-400",
    description: "Rate of adopting emerging technologies",
    percentage: 87,
  },
  {
    label: "Stack Depth",
    value: "96.1",
    icon: <Layers className="w-5 h-5" />,
    color: "text-orange-400",
    description: "Breadth and depth of technical knowledge",
    percentage: 96,
  },
  {
    label: "Pattern IQ",
    value: "91.5",
    icon: <Brain className="w-5 h-5" />,
    color: "text-emerald-400",
    description: "Recognition of architectural patterns",
    percentage: 91,
  },
  {
    label: "Trend Foresight",
    value: "88.9",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-pink-400",
    description: "Alignment with future-defining technologies",
    percentage: 88,
  },
  {
    label: "Community Pull",
    value: "79.3",
    icon: <Globe className="w-5 h-5" />,
    color: "text-yellow-400",
    description: "Influence across developer communities",
    percentage: 79,
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Arjun Mehta",
    handle: "@arjunbuilds",
    role: "Senior Engineer @ Vercel",
    text: "DevAura AI nailed my archetype on the first try. The aura analysis felt like it was reading my soul — it surfaced patterns in my learning I hadn't even consciously noticed.",
    aura: "Architect · 96.2",
    archetype: "Systems Visionary",
    avatar: "AM",
  },
  {
    name: "Sofia Chen",
    handle: "@sofiaonedge",
    role: "Founding Engineer @ Linear",
    text: "The cinematic identity card is stunning. I've shared it more times than any other 'about me' format. It captures what you actually care about, not just your job title.",
    aura: "Pioneer · 91.8",
    archetype: "Edge Explorer",
    avatar: "SC",
  },
  {
    name: "Marcus Webb",
    handle: "@marcusreactnative",
    role: "Staff Eng @ Shopify",
    text: "The future predictions section is eerily accurate. It told me I'd dive deep into AI/ML six months before I actually did. DevAura AI sees the trajectory you're already on.",
    aura: "Alchemist · 89.4",
    archetype: "Full-Stack Transformer",
    avatar: "MW",
  },
];

const STEPS = [
  {
    icon: <GitBranch className="w-6 h-6" />,
    step: "01",
    title: "Connect your daily.dev",
    desc: "Sync your reading history, bookmarks, upvotes, and tag subscriptions in one click.",
    color: "from-violet-600 to-purple-800",
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    step: "02",
    title: "AI Deep Analysis",
    desc: "Our model processes 200+ signals to map your interests, learning velocity, and stack patterns.",
    color: "from-cyan-600 to-blue-800",
  },
  {
    icon: <Eye className="w-6 h-6" />,
    step: "03",
    title: "Aura Generation",
    desc: "Receive your archetype, aura metrics, personality insights, and cinematic identity card.",
    color: "from-orange-600 to-red-800",
  },
];

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────

function GlowOrb({ className }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full blur-[120px] opacity-20 pointer-events-none ${className}`}
    />
  );
}

function GridOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
  );
}

function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent pointer-events-none"
      initial={{ top: "0%" }}
      animate={{ top: "100%" }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
    />
  );
}

function AuraBadge({ score, color }: { score: number; color: string }) {
  return (
    <div className="relative w-16 h-16">
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
        <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <motion.circle
          cx="32"
          cy="32"
          r="26"
          fill="none"
          stroke={`url(#aura-${score})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 26}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
          whileInView={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - score / 100) }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
        />
        <defs>
          <linearGradient id={`aura-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white/90">{score}</span>
      </div>
    </div>
  );
}

function MetricBar({ metric, index }: { metric: Metric; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative p-5 rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 cursor-default"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={metric.color}>{metric.icon}</span>
          <span className="text-sm font-medium text-white/70">{metric.label}</span>
        </div>
        <span className={`text-lg font-bold tabular-nums ${metric.color}`}>{metric.value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
          initial={{ width: 0 }}
          animate={inView ? { width: `${metric.percentage}%` } : {}}
          transition={{ delay: index * 0.1 + 0.3, duration: 1, ease: "easeOut" }}
        />
      </div>
      <p className="mt-2 text-xs text-white/30 group-hover:text-white/50 transition-colors">
        {metric.description}
      </p>
    </motion.div>
  );
}

function ArchetypeCard({ archetype, index }: { archetype: Archetype; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`relative rounded-2xl border border-white/[0.08] bg-[#0a0a0f] overflow-hidden cursor-pointer group transition-all duration-500 ${hovered ? `shadow-2xl ${archetype.glow}` : ""}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${archetype.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${archetype.color} text-white`}>
            {archetype.icon}
          </div>
          <AuraBadge score={archetype.aura} color={archetype.color} />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">{archetype.title}</h3>
        <p className="text-sm text-white/40 mb-4">{archetype.subtitle}</p>
        <div className="flex flex-wrap gap-2">
          {archetype.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.06] text-white/60 border border-white/[0.06]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <motion.div
        className={`h-0.5 bg-gradient-to-r ${archetype.color}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ transformOrigin: "left" }}
      />
    </motion.div>
  );
}

function DevAuraCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto max-w-md"
      style={{ perspective: "1000px" }}
    >
      {/* Card glow */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-violet-500/50 via-cyan-500/30 to-orange-500/20 blur-sm" />
      <div className="relative rounded-2xl border border-white/[0.12] bg-[#07070d] overflow-hidden">
        {/* Holographic shimmer overlay */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, transparent 25%, rgba(139,92,246,0.15) 50%, transparent 75%)",
            backgroundSize: "200% 200%",
            animation: "shimmer 4s linear infinite",
          }}
        />
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-xs font-mono text-violet-400/80 tracking-widest uppercase">DevAura AI</span>
            </div>
            <span className="text-xs font-mono text-white/20">v2.4.1</span>
          </div>
          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xl font-bold text-white">
                JS
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#07070d] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Jae-seong Kim</h4>
              <p className="text-sm text-white/40">@jaeseong · daily.dev</p>
            </div>
          </div>
          {/* Archetype */}
          <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-mono text-violet-400 uppercase tracking-wider">Archetype</span>
            </div>
            <p className="text-white font-semibold">The Architect</p>
            <p className="text-white/40 text-sm">Systems Visionary · Tier I</p>
          </div>
          {/* Mini metrics */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { label: "Aura", val: "94.7", color: "text-violet-400" },
              { label: "Velocity", val: "87.2", color: "text-cyan-400" },
              { label: "Depth", val: "96.1", color: "text-orange-400" },
            ].map((m) => (
              <div key={m.label} className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                <p className={`text-base font-bold tabular-nums ${m.color}`}>{m.val}</p>
                <p className="text-white/30 text-xs">{m.label}</p>
              </div>
            ))}
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {["Rust", "Distributed Systems", "Kubernetes", "eBPF", "Go"].map((t) => (
              <span key={t} className="px-2 py-0.5 text-xs rounded-md bg-white/[0.05] text-white/50 border border-white/[0.06]">
                {t}
              </span>
            ))}
          </div>
          {/* Prediction */}
          <div className="p-3 rounded-xl bg-cyan-500/[0.06] border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">AI Prediction</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Likely to become a core contributor to a WASM runtime within 8 months.
            </p>
          </div>
        </div>
        {/* Footer bar */}
        <div className="px-6 py-3 border-t border-white/[0.05] flex items-center justify-between">
          <span className="text-xs font-mono text-white/20">DEVAURA·IDENTITY</span>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < 4 ? "bg-violet-500" : "bg-white/10"}`} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── SECTIONS ────────────────────────────────────────────────────────────────

function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-20">
      {/* Animated bg orbs */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        <GlowOrb className="w-[800px] h-[800px] bg-violet-600 -top-40 left-1/2 -translate-x-1/2" />
        <GlowOrb className="w-[500px] h-[500px] bg-cyan-600 top-1/2 -left-40" />
        <GlowOrb className="w-[400px] h-[400px] bg-orange-600 top-1/3 -right-20" />
      </motion.div>
      <GridOverlay />
      <ScanLine />

      <motion.div style={{ opacity }} className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          Powered by daily.dev · Built at Hackathon 2026
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6"
        >
          <span className="text-white">Your Developer</span>
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #f97316 100%)",
            }}
          >
            Aura Revealed
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          AI analyzes your reading habits, interests, and learning patterns from daily.dev
          to generate your unique developer archetype, aura score, and cinematic identity card.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-base overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Reveal My Aura
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.04] text-white/70 font-semibold text-base hover:bg-white/[0.07] hover:border-white/20 hover:text-white transition-all duration-300 flex items-center gap-2"
          >
            <Eye className="w-5 h-5" />
            View Demo
          </motion.button>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 flex items-center justify-center gap-8 sm:gap-16 text-center"
        >
          {[
            { val: "47K+", label: "Developers Analyzed" },
            { val: "200+", label: "Aura Signals" },
            { val: "12", label: "Archetypes" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl font-black text-white">{s.val}</p>
              <p className="text-xs text-white/30 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/20 font-mono tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"
        />
      </motion.div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="relative py-28 px-4 overflow-hidden">
      <GlowOrb className="w-[600px] h-[600px] bg-violet-700 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-violet-400 text-sm font-mono tracking-widest uppercase mb-4">
            <Code2 className="w-4 h-4" /> How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            Three steps to your
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}>
              developer identity
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          

          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 group"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${step.color} mb-4 text-white`}>
                {step.icon}
              </div>
              <div className="font-mono text-4xl font-black text-white/[0.06] absolute top-5 right-5 select-none">
                {step.step}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricsSection() {
  return (
    <section className="relative py-28 px-4 overflow-hidden">
      <GlowOrb className="w-[500px] h-[500px] bg-cyan-700 -bottom-20 -right-20 opacity-15" />
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 text-cyan-400 text-sm font-mono tracking-widest uppercase mb-4">
              <BarChart3 className="w-4 h-4" /> Aura Metrics
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              Six-dimensional
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #06b6d4, #8b5cf6)" }}>
                aura analysis
              </span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed mb-8">
              Every developer radiates a unique signal. Our AI maps it across six dimensions
              that capture not just what you know — but how you think and where you're headed.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-cyan-500/30 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/10 transition-all duration-300"
            >
              See Full Breakdown <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Right: metric bars */}
          <div className="grid sm:grid-cols-2 gap-3">
            {METRICS.map((m, i) => (
              <MetricBar key={m.label} metric={m} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ArchetypesSection() {
  return (
    <section className="relative py-28 px-4 overflow-hidden">
      <GlowOrb className="w-[700px] h-[700px] bg-orange-700 -top-40 -left-40 opacity-10" />
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-orange-400 text-sm font-mono tracking-widest uppercase mb-4">
            <Crown className="w-4 h-4" /> Developer Archetypes
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            Which archetype
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #f97316, #8b5cf6)" }}>
              are you?
            </span>
          </h2>
          <p className="mt-4 text-white/40 text-lg max-w-xl mx-auto">
            Twelve distinct developer archetypes derived from 47,000+ analyzed profiles.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ARCHETYPES.map((a, i) => (
            <ArchetypeCard key={a.title} archetype={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowcaseSection() {
  return (
    <section className="relative py-28 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 text-violet-400 text-sm font-mono tracking-widest uppercase mb-4">
              <Star className="w-4 h-4" /> Identity Card
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              Your cinematic
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #8b5cf6, #f97316)" }}>
                developer card
              </span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed mb-6">
              A shareable identity artifact that captures your archetype, top metrics, AI predictions,
              and tech signature — crafted for Twitter, LinkedIn, and your README.
            </p>
            <ul className="space-y-3">
              {[
                { icon: <Shield className="w-4 h-4 text-violet-400" />, text: "Cryptographically unique per developer" },
                { icon: <Sparkles className="w-4 h-4 text-cyan-400" />, text: "Regenerates as your interests evolve" },
                { icon: <Terminal className="w-4 h-4 text-orange-400" />, text: "Exportable as PNG, SVG, or embed code" },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="flex items-center gap-3 text-white/60 text-sm"
                >
                  {item.icon}
                  {item.text}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <DevAuraCard />
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="relative py-28 px-4 overflow-hidden">
      <GlowOrb className="w-[600px] h-[600px] bg-violet-700 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08]" />
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-emerald-400 text-sm font-mono tracking-widest uppercase mb-4">
            <Users className="w-4 h-4" /> Developer Stories
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            Heard across the ecosystem
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.handle}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/30 text-xs">{t.handle}</p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
              <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
                <span className="text-xs text-white/30">{t.role}</span>
                <span className="text-xs font-mono text-violet-400">{t.aura}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="relative py-28 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-violet-950/20 pointer-events-none" />
      <GlowOrb className="w-[900px] h-[600px] bg-violet-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.12]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300 text-sm mb-8">
          <Lock className="w-4 h-4" />
          Free for all daily.dev users during beta
        </div>
        <h2 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
          Your aura is
          <br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #f97316 100%)" }}>
            already forming
          </span>
        </h2>
        <p className="text-white/40 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Every article you read, every tag you follow, every bookmark you save — it's all shaping
          your developer aura. Let DevAura AI reveal what it already knows about you.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-base overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 bg-white" />
            <span className="relative flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Start Your Analysis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
          <p className="text-white/20 text-sm">No credit card · 2 minutes</p>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-white/[0.05] py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-white/70 font-bold text-sm">DevAura AI</span>
          <span className="text-white/20 text-xs">· Hackathon 2026</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-white/25">
          {["Privacy", "Terms", "GitHub", "daily.dev"].map((l) => (
            <a key={l} href="#" className="hover:text-white/60 transition-colors">
              {l}
            </a>
          ))}
        </div>
        <p className="text-xs text-white/20">
          Built with daily.dev API · Powered by Claude
        </p>
      </div>
    </footer>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (v) => setScrolled(v > 20));
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.06] bg-[#05050a]/85 backdrop-blur-2xl shadow-[0_1px_0_rgba(255,255,255,0.04)]"
          : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center overflow-hidden">
            <Sparkles className="w-3.5 h-3.5 text-white relative z-10" />

            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
              initial={{ x: "-150%" }}
              animate={{ x: "150%" }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            />
          </div>

          <span className="text-white font-bold tracking-tight">
            DevAura AI
          </span>
        </motion.div>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-8 text-sm text-white/40">
          {[
            "How It Works",
            "Metrics",
            "Archetypes",
            "Showcase",
          ].map((l) => (
            <a
              key={l}
              href="#"
              className="relative group hover:text-white/90 transition-colors duration-200 py-1"
            >
              {l}

              <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-violet-400 to-cyan-400 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* BUTTON */}
        <a href="/results?username=ayu_buildss">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <span className="relative">
              Get My Aura
            </span>
          </motion.button>
        </a>

      </div>
    </motion.nav>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <main className="relative bg-[#05050a] min-h-screen overflow-x-hidden">
      {/* Global shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <MetricsSection />
      <ArchetypesSection />
      <ShowcaseSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}