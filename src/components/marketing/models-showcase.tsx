const modelProviders = [
  { name: "Flux", type: "Image", logo: "F" },
  { name: "DALL-E 3", type: "Image", logo: "D" },
  { name: "Stable Diffusion", type: "Image", logo: "S" },
  { name: "Ideogram", type: "Text in Image", logo: "I" },
  { name: "Runway", type: "Video", logo: "R" },
  { name: "Kling", type: "Video", logo: "K" },
  { name: "Luma", type: "Video", logo: "L" },
  { name: "GPT-4o", type: "Text", logo: "G" },
];

export function ModelsShowcase() {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <p className="text-violet-400 font-medium mb-3">Model Ecosystem</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              20+ models. One interface.
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Stop juggling API keys and learning different interfaces. LOLA connects to the best image, video, and text models through a unified layer. Switch models mid-workflow or let LOLA pick the best one for your task.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-300">Auto-select best model for your task</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-300">Automatic fallback if a model fails</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-300">Bring your own API keys</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-300">Add custom models via config</span>
              </div>
            </div>
          </div>

          {/* Right: Model cards */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/10 to-purple-600/10 rounded-3xl blur-2xl" />
            <div className="relative grid grid-cols-2 gap-4">
              {modelProviders.map((model, i) => (
                <div 
                  key={i}
                  className="group p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/50 transition-all duration-300 hover:bg-slate-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-lg font-bold text-white group-hover:from-violet-600 group-hover:to-purple-600 transition-all duration-300">
                      {model.logo}
                    </div>
                    <div>
                      <div className="font-medium text-white">{model.name}</div>
                      <div className="text-sm text-slate-500">{model.type}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
