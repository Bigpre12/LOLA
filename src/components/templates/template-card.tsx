import Link from "next/link";
import { Button, Badge } from "@/components/ui";
import { Template, Category } from "@/types";
import { getCategoryLabel } from "@/lib/utils";

interface TemplateCardProps {
  template: Template;
}

const categoryColors: Record<Category, string> = {
  ECOMMERCE: "bg-emerald-500/10 text-emerald-400",
  ADS: "bg-blue-500/10 text-blue-400",
  BRAND: "bg-amber-500/10 text-amber-400",
};

export function TemplateCard({ template }: TemplateCardProps) {
  const outputCount = template.modelPipeline.steps.length;

  return (
    <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-violet-500/50 transition-all group">
      {/* Preview area */}
      <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 p-6 flex items-center justify-center relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNNDAgMEgwdjQwaDQwVjB6TTEgMWgzOHYzOEgxVjF6IiBmaWxsPSIjMzM0MTU1IiBmaWxsLW9wYWNpdHk9Ii4yIi8+PC9nPjwvc3ZnPg==')] opacity-50" />
        
        <div className="relative grid grid-cols-2 gap-2">
          {Array.from({ length: Math.min(outputCount, 4) }).map((_, i) => (
            <div
              key={i}
              className="w-14 h-14 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-lg group-hover:from-violet-500/30 group-hover:to-purple-500/30 transition-colors"
            />
          ))}
        </div>

        {/* Step count badge */}
        <div className="absolute bottom-3 right-3">
          <Badge variant="default" className="bg-slate-900/80 text-slate-300">
            {outputCount} {outputCount === 1 ? "output" : "outputs"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[template.category]}`}>
            {getCategoryLabel(template.category)}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{template.description}</p>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>~{template.estimatedCredits} credits</span>
          </div>
          <Link href={`/run/${template.slug}`}>
            <Button variant="ghost" size="sm">
              Use template
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
