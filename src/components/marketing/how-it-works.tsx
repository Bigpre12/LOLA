export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Pick a template",
      description:
        "Choose from our library of pre-built templates designed for specific outcomes. Product gallery, lifestyle set, social ad pack, and more.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Upload assets & tweak options",
      description:
        "Upload your source images and adjust a few simple options like number of variants, style preferences, or aspect ratios. No technical knowledge required.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "LOLA runs the pipeline",
      description:
        "Our AI pipeline handles the complex multi-step workflow behind the scenes. You get polished outputs without ever seeing a node graph (unless you want to).",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How it works
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            LOLA transforms complex AI workflows into simple 3-step processes.
            No node graphs, no technical setup, just results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-violet-500/50 to-transparent -translate-x-1/2" />
              )}

              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 h-full hover:border-violet-500/50 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center text-violet-400">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-bold text-slate-700">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            You never see a node graph unless you explicitly switch on the &ldquo;Advanced&rdquo; toggle.
          </p>
        </div>
      </div>
    </section>
  );
}
