import Link from "next/link";
import { Button } from "@/components/ui";
import { ShoppingBag, Home, Megaphone, Palette } from "lucide-react";

const recipes = [
  {
    icon: ShoppingBag,
    name: "Full Asset Engine",
    description: "Upload one product photo, get 20+ images: Amazon gallery, lifestyle shots, social ads, thumbnails.",
    outputs: "20+ assets",
    time: "~90 seconds",
    popular: true,
  },
  {
    icon: Home,
    name: "Lifestyle Set",
    description: "Transform studio shots into contextual scenes. Kitchen, office, outdoor, bedroom—your product in real life.",
    outputs: "10 scenes",
    time: "~60 seconds",
    popular: false,
  },
  {
    icon: Megaphone,
    name: "Social Ad Pack",
    description: "Hero image + tagline becomes a full ad suite. Instagram, TikTok, Facebook—all formats, all sizes.",
    outputs: "12 ads",
    time: "~75 seconds",
    popular: false,
  },
  {
    icon: Palette,
    name: "Background Swap",
    description: "Place your product in any environment. Studio, nature, urban, abstract—you choose, we generate.",
    outputs: "8 variants",
    time: "~45 seconds",
    popular: false,
  },
];

export function RecipesPreview() {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-slate-950 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-slate-950 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-violet-400 font-medium mb-3">Ready-made recipes</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Outcome-first templates
          </h2>
          <p className="text-lg text-slate-400">
            Pick a goal. LOLA handles the multi-model workflow, editing steps, and output formatting automatically.
          </p>
        </div>

        {/* Recipes grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {recipes.map((recipe, i) => (
            <div 
              key={i}
              className="group relative p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/50 transition-all duration-300"
            >
              {recipe.popular && (
                <div className="absolute -top-3 right-6">
                  <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full">
                    Most popular
                  </span>
                </div>
              )}
              
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-slate-700/50 flex items-center justify-center group-hover:bg-violet-600/20 transition-colors">
                  <recipe.icon className="w-7 h-7 text-slate-400 group-hover:text-violet-400 transition-colors" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">
                    {recipe.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    {recipe.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-500">{recipe.outputs}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500">{recipe.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/templates">
            <Button variant="outline" size="lg" className="rounded-xl">
              View all recipes
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
