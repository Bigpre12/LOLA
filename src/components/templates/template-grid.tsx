"use client";

import { useState } from "react";
import { TemplateCard } from "./template-card";
import { Template, Category } from "@/types";
import { cn } from "@/lib/utils";

interface TemplateGridProps {
  templates: Template[];
  initialCategory?: Category | "ALL";
}

const categories: { value: Category | "ALL"; label: string }[] = [
  { value: "ALL", label: "All templates" },
  { value: "ECOMMERCE", label: "Ecommerce" },
  { value: "ADS", label: "Ads" },
  { value: "BRAND", label: "Brand" },
];

export function TemplateGrid({ templates, initialCategory = "ALL" }: TemplateGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | "ALL">(initialCategory);

  const filteredTemplates =
    selectedCategory === "ALL"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              selectedCategory === category.value
                ? "bg-violet-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            )}
          >
            {category.label}
            {category.value !== "ALL" && (
              <span className="ml-2 text-xs opacity-70">
                ({templates.filter((t) => t.category === category.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h3 className="text-white font-medium mb-2">No templates found</h3>
          <p className="text-slate-400">No templates in this category yet.</p>
        </div>
      )}
    </div>
  );
}
