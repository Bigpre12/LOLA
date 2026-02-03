import { 
  Layers, 
  Zap, 
  Wand2, 
  Users, 
  BarChart3,
  FolderOpen 
} from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "All models, unified",
    description: "Connect leading image, video, and 3D models through a single interface. Mix generation, editing, upscaling, and compositing without switching tools.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Zap,
    title: "Built for creative flow",
    description: "Use simple, goal-based recipes instead of complex graphs. Start with templates for product galleries, lifestyle sets, and ad packs, then customize when you're ready.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Wand2,
    title: "Professional tools, supercharged",
    description: "Masking, inpainting, relighting, upscaling, and multi-layer compositing are built in. Chain them into repeatable workflows your whole team can use.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: FolderOpen,
    title: "Campaign-ready bundles",
    description: "Get organized asset packs instead of single images. Platform-specific folders, correct sizes, A/B variants tagged and ready to test.",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: Users,
    title: "Designed to scale",
    description: "Turn your best workflows into reusable recipes. Share them with your team, add guardrails, and track what works over time.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: BarChart3,
    title: "Built-in feedback loops",
    description: "Rate outputs, track template performance, and let the system learn which recipes actually work for your brand and goals.",
    gradient: "from-indigo-500 to-violet-500",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/50" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-violet-400 font-medium mb-3">Why LOLA</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Everything you need to create at scale
          </h2>
          <p className="text-lg text-slate-400">
            All your favorite AI models and pro tools in one place. Outcome-first recipes for images, video, and 3D.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="group relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:bg-slate-900/80"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
