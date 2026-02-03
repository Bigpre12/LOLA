import { ArrowRight, Upload, Sparkles, Package } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload one asset",
    description: "A product photo, hero image, or raw creative. That's all you need.",
  },
  {
    icon: Sparkles,
    title: "Pick a recipe",
    description: "Choose what you want: product gallery, lifestyle set, ad pack, or full campaign.",
  },
  {
    icon: Package,
    title: "Get your campaign",
    description: "Download platform-ready bundles organized by placement, sized correctly, A/B tagged.",
  },
];

export function WorkflowPreview() {
  return (
    <section className="py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-violet-400 font-medium mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            From upload to campaign in minutes
          </h2>
          <p className="text-lg text-slate-400">
            No learning curve. No node graphs. Just results.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-slate-700 to-transparent" />
              )}
              
              <div className="relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-violet-600 text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-5">
                  <step.icon className="w-8 h-8 text-violet-400" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Demo visualization */}
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between gap-4">
              {/* Input */}
              <div className="flex-shrink-0 text-center">
                <div className="w-24 h-24 rounded-xl bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center mb-2">
                  <Upload className="w-8 h-8 text-slate-500" />
                </div>
                <span className="text-xs text-slate-500">1 photo</span>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-violet-600/20 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-violet-400" />
                </div>
              </div>

              {/* LOLA processing */}
              <div className="flex-shrink-0 text-center">
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/30 flex items-center justify-center mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">L</span>
                  </div>
                </div>
                <span className="text-xs text-slate-500">LOLA</span>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-violet-600/20 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-violet-400" />
                </div>
              </div>

              {/* Outputs */}
              <div className="flex-1">
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div 
                      key={i}
                      className="aspect-square rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30"
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500">20+ campaign assets</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
