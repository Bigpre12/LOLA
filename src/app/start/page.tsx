"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";

const killShots = [
  {
    id: "full-asset-engine",
    title: "Full product gallery from 1 photo",
    description: "Amazon gallery + lifestyle shots + ads + thumbnails + all platform crops. 20+ assets, one click.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    href: "/run/full-asset-engine",
    stats: "~20 assets • ~$2.00 • 90 seconds",
    color: "from-violet-500 to-purple-600",
    popular: true,
  },
  {
    id: "lifestyle-set",
    title: "Lifestyle set from 1 studio shot",
    description: "Transform a boring product photo into 10 lifestyle scenes. Kitchen, office, outdoor, bedroom — done.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    href: "/run/lifestyle-set",
    stats: "~10 assets • ~$1.00 • 60 seconds",
    color: "from-emerald-500 to-teal-600",
    popular: false,
  },
  {
    id: "social-ad-pack",
    title: "Ad pack from hero + tagline",
    description: "Instagram, TikTok, Facebook, Twitter — all formats, all sizes, ready for your ad manager.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
    href: "/run/social-ad-pack",
    stats: "~12 assets • ~$1.20 • 75 seconds",
    color: "from-orange-500 to-red-600",
    popular: false,
  },
];

export default function StartPage() {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    
    setIsLoading(true);
    // Navigate to URL scraper flow
    router.push(`/start/from-url?url=${encodeURIComponent(urlInput)}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="pt-8 pb-4 px-4">
        <Link href="/" className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="text-xl font-black text-white">LOLA</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
        <div className="max-w-3xl w-full">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              What do you want to make?
            </h1>
            <p className="text-xl text-slate-400">
              Pick one. Upload one photo. <span className="text-violet-400">LOLA</span> builds your whole campaign.
            </p>
          </div>

          {/* URL Input - The magic shortcut */}
          <div className="mb-8">
            <form onSubmit={handleUrlSubmit} className="relative">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/50 rounded-2xl p-2 focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20">
                <div className="pl-3">
                  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Paste a product URL and we'll do the rest..."
                  className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none py-3 px-2"
                />
                <Button type="submit" disabled={isLoading || !urlInput.trim()}>
                  {isLoading ? "Loading..." : "Go"}
                </Button>
              </div>
              <p className="text-center text-xs text-slate-500 mt-2">
                Works with Amazon, Shopify, any product page — we scrape images, copy, and brand vibes
              </p>
            </form>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-sm text-slate-500">or pick a recipe</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Kill shot buttons */}
          <div className="space-y-4">
            {killShots.map((shot) => (
              <Link key={shot.id} href={shot.href}>
                <div className={`relative group cursor-pointer rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 hover:border-slate-600 transition-all hover:scale-[1.02]`}>
                  {shot.popular && (
                    <div className="absolute -top-3 right-6">
                      <span className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                        Most popular
                      </span>
                    </div>
                  )}
                  <div className="flex items-start gap-5">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${shot.color} flex items-center justify-center text-white`}>
                      {shot.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
                        {shot.title}
                      </h3>
                      <p className="text-slate-400 mt-1">{shot.description}</p>
                      <p className="text-sm text-slate-500 mt-2">{shot.stats}</p>
                    </div>
                    <div className="flex-shrink-0 self-center">
                      <svg className="w-6 h-6 text-slate-600 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom text */}
          <p className="text-center text-sm text-slate-500 mt-8">
            No node graphs. No model picking. No tutorials needed.
            <br />
            <span className="text-slate-400">Just results.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
