export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20 relative overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.3em] text-cyan-400 text-sm mb-4">
            DevAura Results
          </p>

          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Your Developer
            <span className="block bg-gradient-to-r from-purple-400 via-cyan-400 to-orange-400 bg-clip-text text-transparent">
              Aura Revealed
            </span>
          </h1>

          <p className="text-zinc-400 text-lg mt-6 max-w-2xl mx-auto">
            AI-generated identity based on your ecosystem behavior,
            learning signals, and stack resonance.
          </p>
        </div>

        {/* Main Card */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left Side */}
          <div className="space-y-8">

            <div>
              <p className="text-cyan-400 uppercase tracking-[0.2em] text-sm mb-3">
                Primary Archetype
              </p>

              <h2 className="text-5xl font-black">
                The Alchemist
              </h2>

              <p className="text-zinc-400 mt-4 text-lg">
                You bridge engineering and intelligence —
                transforming ideas into scalable AI systems.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                <p className="text-zinc-500 text-sm">Aura Score</p>
                <h3 className="text-4xl font-bold text-purple-400 mt-2">
                  94.7
                </h3>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                <p className="text-zinc-500 text-sm">Tech Velocity</p>
                <h3 className="text-4xl font-bold text-cyan-400 mt-2">
                  87.2
                </h3>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                <p className="text-zinc-500 text-sm">Pattern IQ</p>
                <h3 className="text-4xl font-bold text-orange-400 mt-2">
                  91.3
                </h3>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                <p className="text-zinc-500 text-sm">Community Pull</p>
                <h3 className="text-4xl font-bold text-pink-400 mt-2">
                  79.8
                </h3>
              </div>

            </div>

          </div>

          {/* Right Side Card */}
          <div className="relative">

            <div className="bg-zinc-950/80 border border-zinc-800 rounded-[32px] p-8 backdrop-blur-xl shadow-2xl">

              <div className="flex items-center gap-4 mb-8">

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-2xl font-black">
                  A
                </div>

                <div>
                  <h3 className="text-2xl font-bold">
                    Ayush Agarwal
                  </h3>

                  <p className="text-zinc-400">
                    @ayu_buildss
                  </p>
                </div>

              </div>

              <div className="space-y-5">

                <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
                  <p className="text-sm text-cyan-400 uppercase tracking-[0.2em] mb-2">
                    AI Prediction
                  </p>

                  <p className="text-zinc-300 leading-relaxed">
                    Likely to evolve into a high-impact AI systems architect
                    focused on automation, ML infrastructure, and developer tooling.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">

                  {[
                    "AI/ML",
                    "Next.js",
                    "Automation",
                    "Developer Tools",
                    "Machine Learning",
                    "Backend"
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}