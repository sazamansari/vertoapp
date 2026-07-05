import React from "react";
import dynamic from "next/dynamic";
import { BackgroundEffects } from "@/components/landing/BackgroundEffects";
import { HeroSection } from "@/components/landing/HeroSection";

// Dynamically import below-the-fold components
const InteractiveComparison = dynamic(() => import("@/components/landing/InteractiveComparison").then(mod => mod.InteractiveComparison));
const TargetAudience = dynamic(() => import("@/components/landing/TargetAudience").then(mod => mod.TargetAudience));
const SocialProof = dynamic(() => import("@/components/landing/SocialProof").then(mod => mod.SocialProof));

export default function LandingPage() {

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
