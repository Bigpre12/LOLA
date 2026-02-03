"use client";

import Link from "next/link";
import { Button } from "@/components/ui";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px]" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 lg:pt-32 lg:pb-40">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo mark */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl blur-xl opacity-50" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-black text-4xl">L</span>
              </div>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">One asset.</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
              Complete campaign.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-slate-300 mb-4 max-w-2xl mx-auto leading-relaxed font-light">
            LOLA is an AI creative engine that turns one asset into a complete visual campaign.
          </p>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Pick a recipe. Upload your asset. LOLA handles the multi-model workflow behind the scenes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/start">
              <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow">
                Start creating
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 py-6 rounded-xl border-slate-700 hover:bg-slate-800/50">
                Explore recipes
              </Button>
            </Link>
          </div>

          {/* Social proof / stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-slate-400">20+ AI models</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-slate-400">One unified interface</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-slate-400">Campaign-ready outputs</span>
            </div>
          </div>
        </div>

        {/* Preview window */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-violet-600/20 rounded-3xl blur-2xl" />
            
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-900/90 backdrop-blur-sm shadow-2xl">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50 bg-slate-800/50">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-600" />
                  <div className="w-3 h-3 rounded-full bg-slate-600" />
                  <div className="w-3 h-3 rounded-full bg-slate-600" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-slate-700/50 rounded-lg text-xs text-slate-400">
                    LOLA — Full Asset Engine
                  </div>
                </div>
              </div>

              {/* Content preview */}
              <div className="p-8 bg-gradient-to-b from-slate-900 to-slate-950">
                <div className="grid grid-cols-4 gap-3">
                  {/* Input asset */}
                  <div className="col-span-1 space-y-3">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Input</div>
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600/50 flex items-center justify-center">
                      <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Output assets */}
                  <div className="col-span-3 space-y-3">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Campaign Assets</div>
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="aspect-square rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20"
                          style={{ animationDelay: `${i * 100}ms` }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-xs text-slate-500">Amazon</span>
                      <span className="text-xs text-slate-500">Social</span>
                      <span className="text-xs text-slate-500">Lifestyle</span>
                      <span className="text-xs text-slate-500">Thumbnails</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
