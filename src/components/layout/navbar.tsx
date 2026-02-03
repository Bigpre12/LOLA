"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui";
import { useState } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-black text-white">LOLA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/templates" className="text-slate-300 hover:text-white transition-colors">
              Recipes
            </Link>
            <Link href="/#how-it-works" className="text-slate-300 hover:text-white transition-colors">
              How it works
            </Link>
            <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">
              Pricing
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="ghost" size="sm">
                    Analytics
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">
                    {session.user.credits} credits
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button size="sm">Start free</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <div className="flex flex-col gap-4">
              <Link href="/templates" className="text-slate-300 hover:text-white transition-colors">
                Recipes
              </Link>
              <Link href="/#how-it-works" className="text-slate-300 hover:text-white transition-colors">
                How it works
              </Link>
              <Link href="/#pricing" className="text-slate-300 hover:text-white transition-colors">
                Pricing
              </Link>
              {session ? (
                <>
                  <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-left text-slate-400 hover:text-white transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link href="/auth/signin">
                  <Button className="w-full">Start free</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
