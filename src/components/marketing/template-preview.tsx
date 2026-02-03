import Link from "next/link";
import { Button } from "@/components/ui";

const templates = [
  {
    slug: "product-gallery",
    name: "Product Gallery",
    category: "Ecommerce",
    description: "Amazon-style product gallery from one clean product photo",
    credits: 8,
    outputs: 4,
  },
  {
    slug: "lifestyle-set",
    name: "Lifestyle Set",
    category: "Ecommerce",
    description: "Lifestyle photography set from a studio product image",
    credits: 12,
    outputs: 6,
  },
  {
    slug: "social-ad-pack",
    name: "Social Ad Pack",
    category: "Ads",
    description: "Multi-format ad pack from one hero image and tagline",
    credits: 10,
    outputs: 5,
  },
];

export function TemplatePreview() {
  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready-to-use templates
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Start with templates built for real-world outcomes. Each one encapsulates
            a multi-step AI pipeline tuned for quality results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {templates.map((template) => (
            <div
              key={template.slug}
              className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-violet-500/50 transition-all group"
            >
              {/* Preview area */}
              <div className="aspect-video bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-6 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: Math.min(template.outputs, 4) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 bg-slate-700/50 rounded-lg group-hover:bg-violet-500/20 transition-colors"
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-violet-400 bg-violet-400/10 px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{template.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    ~{template.credits} credits • {template.outputs} outputs
                  </span>
                  <Link href={`/run/${template.slug}`}>
                    <Button variant="ghost" size="sm">
                      Use template
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/templates">
            <Button variant="outline" size="lg">
              View all templates
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
