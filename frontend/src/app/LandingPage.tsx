"use client";

import React, { useEffect } from "react";
import { BackgroundEffects } from "@/components/landing/BackgroundEffects";
import { HeroSection } from "@/components/landing/HeroSection";
import { InteractiveComparison } from "@/components/landing/InteractiveComparison";
import { TargetAudience } from "@/components/landing/TargetAudience";
import { SocialProof } from "@/components/landing/SocialProof";

export default function LandingPage() {
  // Smooth scroll behavior can be applied here or globally
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden font-sans">
      {/* Navigation (Simplified for landing) */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter text-white">
            Evolvian<span className="text-indigo-400">.</span>
          </div>
        </div>
      </nav>

      {/* Main Content Sections */}
      <main className="relative w-full flex flex-col items-center">
        <BackgroundEffects />
        <HeroSection />
        <InteractiveComparison />
        <TargetAudience />
        <SocialProof />
        
        {/* Simple Footer */}
        <footer className="relative z-10 w-full py-12 text-center text-gray-400 border-t border-white/5 bg-[#0B0F19]/50 backdrop-blur-md">
          <p className="mb-2 font-medium">&copy; {new Date().getFullYear()} Evolvian Inc. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
