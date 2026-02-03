import Link from "next/link";
import { Button } from "@/components/ui";

export function CTASection() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[120px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 md:p-16 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-600/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-600/20 to-transparent rounded-full blur-3xl" />
            
            <div className="relative text-center">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <span className="text-white font-black text-3xl">L</span>
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to create at scale?
              </h2>
              <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                Upload one asset. Get your whole campaign. No credit card required to start.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/start">
                  <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-base rounded-xl shadow-lg shadow-violet-500/25">
                    Start creating free
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-6 text-base rounded-xl border-slate-600">
                    Explore recipes
                  </Button>
                </Link>
              </div>

              <p className="mt-8 text-sm text-slate-500">
                100 free credits included. No setup required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
