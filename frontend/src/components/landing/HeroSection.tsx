"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumCTAButton } from "../ui/premium-cta-button";
import { TiltCard } from "../ui/tilt-card";
import Image from "next/image";
import Link from "next/link";
import { 
  Terminal, Code2, Cpu, Calendar, CheckSquare, 
  Users, Activity, Trophy, PlayCircle, Layers
} from "lucide-react";

// Letter-by-letter headline animation
const headlineWords = ["Build.", "Learn.", "Deliver.", "With", "AI."];

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const wordVariants: any = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 10 }
  }
};

// UI Illustration components to replace static icons
function TaskOrbitIllustration() {
  return (
    <div className="relative w-full h-48 bg-[#0F172A] rounded-2xl border border-white/10 overflow-hidden shadow-inner mb-6 p-4">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      
      {/* Animated Kanban Board */}
      <div className="flex gap-2 h-full relative z-10">
        <div className="w-1/3 bg-white/5 rounded-lg p-2 border border-white/5 flex flex-col gap-2">
          <div className="w-12 h-2 bg-indigo-500/50 rounded-full mb-2" />
          <motion.div 
            animate={{ y: [0, 5, 0] }} 
            transition={{ duration: 4, repeat: Infinity }}
            className="w-full h-8 bg-indigo-500/20 rounded border border-indigo-500/30" 
          />
          <div className="w-full h-10 bg-white/5 rounded border border-white/10" />
        </div>
        
        <div className="w-1/3 bg-white/5 rounded-lg p-2 border border-white/5 flex flex-col gap-2">
          <div className="w-12 h-2 bg-purple-500/50 rounded-full mb-2" />
          <div className="w-full h-10 bg-white/5 rounded border border-white/10" />
          <motion.div 
            animate={{ y: [0, -5, 0] }} 
            transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
            className="w-full h-12 bg-purple-500/20 rounded border border-purple-500/30" 
          />
        </div>
        
        <div className="w-1/3 bg-white/5 rounded-lg p-2 border border-white/5 flex flex-col gap-2 relative">
          <div className="w-12 h-2 bg-blue-500/50 rounded-full mb-2" />
          {/* AI Robot Agent floating */}
          <motion.div
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] flex items-center justify-center"
            animate={{ y: [0, -8, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cpu className="w-4 h-4 text-white" />
          </motion.div>
          <div className="w-full h-8 bg-white/5 rounded border border-white/10 mt-2" />
        </div>
      </div>
    </div>
  );
}

function CodeSkillIllustration() {
  const [codeLines, setCodeLines] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCodeLines(prev => (prev + 1) % 5);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-48 bg-[#0B0F19] rounded-2xl border border-white/10 overflow-hidden shadow-inner mb-6 flex flex-col">
      {/* Mac window header */}
      <div className="w-full h-6 bg-white/5 border-b border-white/10 flex items-center px-3 gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
      </div>
      
      {/* Editor Body */}
      <div className="flex-1 p-4 flex gap-4 relative">
        <div className="w-full h-full relative overflow-hidden font-mono text-xs text-orange-400/80">
          <AnimatePresence>
            {[...Array(codeLines + 1)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="mb-2"
              >
                <span className="text-pink-500">function</span> <span className="text-yellow-400">solve</span>() {'{'}
                <br />&nbsp;&nbsp;<span className="text-indigo-400">return</span> <span className="text-green-400">"Success"</span>;
                <br />{'}'}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Floating Trophy Badge */}
        <motion.div
          className="absolute bottom-4 right-4 w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center justify-center border border-white/20"
          animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Trophy className="w-6 h-6 text-white" />
        </motion.div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-4">
      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
        
        {/* LEFT: TaskOrbit AI Project Manager */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="order-2 lg:order-1 flex justify-center"
        >
          <TiltCard 
            intensity={25} 
            glowColor="rgba(99, 102, 241, 0.4)" 
            className="w-full max-w-md rounded-[32px] p-[1px] bg-gradient-to-br from-indigo-500/60 to-purple-500/60"
          >
            <div className="bg-white/10 backdrop-blur-3xl rounded-[31px] p-6 h-full flex flex-col shadow-2xl border border-white/20 text-white">
              <TaskOrbitIllustration />
              
              <h3 className="text-2xl font-bold mb-1 flex items-center gap-2">
                <Image src="/icon.svg" alt="TaskOrbit Logo" height={28} width={28} unoptimized />
                TaskOrbit
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] uppercase font-bold tracking-wider border border-indigo-500/30">
                  AI Active
                </span>
              </h3>
              <p className="text-indigo-300 font-medium mb-4">AI Project Management Platform</p>
              
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/10 hover:bg-white/10 transition-colors">
                  <CheckSquare className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm font-medium">Smart Sprint</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/10 hover:bg-white/10 transition-colors">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-medium">Risk Predict</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/10 hover:bg-white/10 transition-colors">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium">Timeline AI</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/10 hover:bg-white/10 transition-colors">
                  <Users className="w-5 h-5 text-violet-400" />
                  <span className="text-sm font-medium">Workload</span>
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* CENTER: Hero Text & Premium CTAs */}
        <div className="order-1 lg:order-2 flex flex-col items-center text-center px-4 relative z-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-6xl md:text-8xl font-black tracking-tighter"
          >
            {headlineWords.map((word, i) => (
              <motion.span key={i} variants={wordVariants} className="text-white drop-shadow-xl relative">
                {word === "AI." ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 relative">
                    {word}
                    {/* Glowing particle effect specific to AI word */}
                    <motion.div 
                      className="absolute -top-4 -right-4 w-6 h-6 bg-purple-500 rounded-full blur-xl opacity-50"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="mb-10 text-white/80"
          >
            <p className="text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
              One platform. Two intelligent products.
            </p>
            <p className="text-lg max-w-lg mx-auto leading-relaxed">
              Helping students, developers, and enterprises build faster using futuristic AI-powered coding and management workflows.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
            className="flex flex-col sm:flex-row items-center gap-5 w-full justify-center"
          >
            <Link href="/sign-in" className="w-full sm:w-auto">
              <PremiumCTAButton variant="primary" className="w-full">
                Explore Platform
              </PremiumCTAButton>
            </Link>
            <PremiumCTAButton variant="secondary" className="w-full sm:w-auto">
              Book Demo
            </PremiumCTAButton>
          </motion.div>
        </div>

        {/* RIGHT: CodeSkill AI Platform */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="order-3 flex justify-center"
        >
          <TiltCard 
            intensity={25} 
            glowColor="rgba(245, 158, 11, 0.4)" 
            className="w-full max-w-md rounded-[32px] p-[1px] bg-gradient-to-br from-yellow-400/60 to-orange-500/60"
          >
            <div className="bg-white/10 backdrop-blur-3xl rounded-[31px] p-6 h-full flex flex-col shadow-2xl border border-white/20 text-white">
              <CodeSkillIllustration />
              
              <h3 className="text-2xl font-bold mb-1 flex items-center gap-2">
                <Image src="/logo.svg" alt="CodeSkill Logo" height={28} width={28} unoptimized />
                CodeSkill
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] uppercase font-bold tracking-wider border border-orange-500/30">
                  Interview Mode
                </span>
              </h3>
              <p className="text-orange-300 font-medium mb-4">AI Coding Interview Platform</p>

              <div className="grid grid-cols-2 gap-3 mt-auto">
                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/10 hover:bg-white/10 transition-colors">
                  <Code2 className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-medium">Problems</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/10 hover:bg-white/10 transition-colors">
                  <Terminal className="w-5 h-5 text-orange-400" />
                  <span className="text-sm font-medium">AI Editor</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/10 hover:bg-white/10 transition-colors">
                  <PlayCircle className="w-5 h-5 text-red-400" />
                  <span className="text-sm font-medium">Contests</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/10 hover:bg-white/10 transition-colors">
                  <Layers className="w-5 h-5 text-pink-400" />
                  <span className="text-sm font-medium">Hiring</span>
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
