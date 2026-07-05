"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, BarChart3, Brain, Users, CalendarDays, Rocket,
  Code2, Bot, Trophy, ListOrdered, Building2, FileSearch, ArrowRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TiltCard } from "../ui/tilt-card";
import { RippleContainer } from "../ui/ripple";
import { cn } from "@/lib/utils";

import { useCodeSkillTerminal } from "@/store/useCodeSkillTerminal";

// --- LIVE PREVIEWS --- //
function TaskOrbitLivePreview() {
  return (
    <motion.div layoutId="preview-taskorbit" className="relative w-full h-36 md:h-44 bg-[#0B0F19]/50 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-inner mb-6 flex flex-col justify-end p-4">
      {/* Kanban Board Container */}
      <div className="flex gap-3 w-full h-[85%] items-end relative z-10">
        {[1, 2, 3].map((col, i) => (
          <div key={i} className="flex-1 bg-white/5 rounded-lg p-2 flex flex-col gap-2 h-full">
            <div className="w-8 h-1.5 bg-white/20 rounded-full mb-1" />
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
              className="w-full h-8 bg-indigo-500/20 rounded-md border border-indigo-500/30"
            />
            {i !== 2 && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
                className="w-full h-8 bg-white/5 rounded-md border border-white/10"
              />
            )}
          </div>
        ))}
      </div>

      {/* Floating Robot Agent */}
      <motion.div
        className="absolute top-4 right-6 w-8 h-8 rounded-xl bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.8)] flex items-center justify-center z-20 border border-white/20"
        animate={{ y: [0, -8, 0], rotate: [0, 8, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Brain className="w-4 h-4 text-white" />
      </motion.div>
    </motion.div>
  );
}

function CodeSkillLivePreview() {
  const codeLines = useCodeSkillTerminal();

  return (
    <motion.div layoutId="preview-codeskill" className="relative w-4/5 mx-auto h-32 md:h-36 bg-[#0B0F19]/80 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-inner mb-6 flex flex-col">
      {/* Window Header */}
      <div className="w-full h-5 bg-white/5 border-b border-white/10 flex items-center px-2.5 gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
      </div>

      {/* Code Editor */}
      <div className="flex-1 p-4 font-mono text-[10px] md:text-xs relative">
        <AnimatePresence>
          {[
            <span key="1"><span className="text-pink-500">const</span> <span className="text-yellow-400">solve</span> = <span className="text-blue-400">async</span> () {`=> {`}</span>,
            <span key="2">  <span className="text-indigo-400">return</span> <span className="text-green-400">"Success"</span>;</span>,
            <span key="3">{`}`}</span>
          ].slice(0, codeLines + 1).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="mb-1.5 whitespace-pre"
            >
              {line}
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Output Console Box */}
        <motion.div
          className="absolute bottom-3 left-3 w-28 bg-black/80 rounded border border-white/10 p-1 font-mono text-[7px] leading-tight overflow-hidden backdrop-blur-md flex flex-col justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: codeLines >= 3 ? 1 : 0.4, y: 0 }}
        >
          <div className="text-gray-400">$ node run.js</div>
          {codeLines >= 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 mt-0.5">
              {">"} "Success"<br /><span className="text-gray-500">Time: 4ms</span>
            </motion.div>
          )}
        </motion.div>

        {/* Floating Success Badge */}
        <motion.div
          className="absolute bottom-4 right-4 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 shadow-[0_0_15px_rgba(245,158,11,0.6)] flex items-center justify-center z-20 border border-white/20"
          animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Trophy className="w-4 h-4 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
}

// --- PREMIUM CTA --- //
function PremiumShowcaseCTA({ text, colorFrom, colorTo, glowColor, layoutId }: { text: string; colorFrom: string; colorTo: string; glowColor: string, layoutId: string }) {
  return (
    <div className="block w-full mt-8 relative z-30 pointer-events-none">
      <motion.div
        layoutId={layoutId}
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative h-[72px] w-full rounded-full flex items-center justify-center overflow-hidden cursor-pointer",
          "border border-white/20 group transition-all duration-300",
          glowColor
        )}
      >
        {/* Animated Gradient Background */}
        <div className={cn("absolute inset-0 opacity-90 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r", colorFrom, colorTo)} />

        {/* Glass Shine Sweep */}
        <motion.div
          className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
          initial={{ left: "-100%" }}
          variants={{
            hover: { left: "200%", transition: { duration: 1, ease: "easeInOut" } }
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <Zap className="w-5 h-5 text-white/80" />
          <span className="text-white font-bold text-lg tracking-wide">{text}</span>
          <motion.div
            variants={{
              hover: { x: [0, 5, 0], transition: { duration: 1, repeat: Infinity } }
            }}
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// --- FLOATING CHIPS --- //
const taskOrbitChips = [
  { text: "Sprint AI", icon: Zap },
  { text: "Analytics", icon: BarChart3 },
  { text: "Smart Planning", icon: Brain },
  { text: "Team Sync", icon: Users },
  { text: "Timeline", icon: CalendarDays },
  { text: "Automation", icon: Rocket },
];

const codeSkillChips = [
  { text: "Live Coding", icon: Code2 },
  { text: "AI Interview", icon: Bot },
  { text: "Contests", icon: Trophy },
  { text: "Leaderboard", icon: ListOrdered },
  { text: "Company Tests", icon: Building2 },
  { text: "Resume AI", icon: FileSearch },
];

// --- BACKGROUND INTERNAL EFFECT --- //
function CardBackground({ colorClass }: { colorClass: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[39px] pointer-events-none z-0">
      <div className={cn("absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] transition-colors duration-1000", colorClass)} />

      {/* SVG Neural Net */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <pattern id="card-neural-net" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1.5" fill="#FFF" />
          <line x1="10" y1="10" x2="30" y2="30" stroke="#FFF" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#card-neural-net)" />
      </svg>

      {/* Floating Particles */}
      {mounted && [...Array(3)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full bg-white/30 backdrop-blur-sm border border-white/10"
          style={{
            width: Math.random() * 40 + 20 + "px",
            height: Math.random() * 40 + 20 + "px",
            left: Math.random() * 80 + 10 + "%",
            top: Math.random() * 80 + 10 + "%",
          }}
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// --- MAIN COMPONENT --- //
export function InteractiveComparison() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    // Navigate with framer-motion transition
    setTimeout(() => {
      router.push(path);
    }, 250);
  };

  return (
    <section className="relative z-10 w-full py-16 px-4 border-y border-white/10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg tracking-tight"
          >
            Two Products. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">Unmatched Power.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium"
          >
            Choose the tool that fits your current mission, or seamlessly use both within our unified platform.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* TASK ORBIT SHOWCASE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
            className="flex justify-center h-full w-full"
            onClick={() => handleNavigation('/taskorbit')}
          >
            <TiltCard
              intensity={10}
              glowColor="rgba(99, 102, 241, 0.4)"
              className="w-full h-full rounded-[32px] p-[1px] bg-gradient-to-br from-indigo-500/60 to-purple-500/60 cursor-pointer"
            >
              <RippleContainer className="bg-[#0B0F19]/80 backdrop-blur-3xl rounded-[31px] p-5 md:p-8 h-full flex flex-col shadow-2xl border-2 border-white/10 group-hover:border-cyan-400 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all duration-300 relative overflow-hidden group">
                <CardBackground colorClass="bg-indigo-500/20 group-hover:bg-indigo-500/40" />

                {/* 1. TOP: Live Preview */}
                <div className="relative z-10 w-full">
                  <TaskOrbitLivePreview />
                </div>

                {/* 2. MIDDLE: Title & Chips */}
                <div className="relative z-10 flex-grow flex flex-col items-center text-center">
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div layoutId="logo-taskorbit">
                      <Image src="/icon.svg" alt="TaskOrbit Logo" height={32} width={32} unoptimized />
                    </motion.div>
                    <motion.h3 layoutId="title-taskorbit" className="text-2xl font-black text-white tracking-tight">TaskOrbit</motion.h3>
                  </div>
                  <h4 className="text-indigo-300 font-bold text-base mb-1">AI Project Management</h4>
                  <p className="text-gray-400 text-sm font-medium mb-6 max-w-[280px]">Predict delivery. Automate planning. Empower high-performing teams.</p>

                  {/* Floating AI Chips */}
                  <div className="flex flex-wrap justify-center gap-3">
                    {taskOrbitChips.map((chip, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                        className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full py-2 px-4 hover:bg-indigo-500/30 hover:border-indigo-500/50 transition-colors cursor-default backdrop-blur-md"
                      >
                        <chip.icon className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-semibold text-indigo-100">{chip.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 3. BOTTOM: Premium CTA */}
                <PremiumShowcaseCTA
                  text="Launch TaskOrbit"
                  layoutId="cta-taskorbit"
                  colorFrom="from-indigo-600"
                  colorTo="to-purple-600"
                  glowColor="shadow-[0_0_30px_rgba(79,70,229,0.4)] group-hover:shadow-[0_0_60px_rgba(79,70,229,0.7)]"
                />
              </RippleContainer>
            </TiltCard>
          </motion.div>

          {/* CODE SKILL SHOWCASE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.4, delay: 0.2 }}
            className="flex justify-center h-full w-full"
            onClick={() => handleNavigation('/codeskill')}
          >
            <TiltCard
              intensity={10}
              glowColor="rgba(245, 158, 11, 0.4)"
              className="w-full h-full rounded-[32px] p-[1px] bg-gradient-to-br from-yellow-400/60 to-orange-500/60 cursor-pointer"
            >
              <RippleContainer className="bg-[#0B0F19]/80 backdrop-blur-3xl rounded-[31px] p-5 md:p-8 h-full flex flex-col shadow-2xl border-2 border-white/10 group-hover:border-cyan-400 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all duration-300 relative overflow-hidden group">
                <CardBackground colorClass="bg-orange-500/20 group-hover:bg-orange-500/40" />

                {/* 1. TOP: Live Preview */}
                <div className="relative z-10 w-full">
                  <CodeSkillLivePreview />
                </div>

                {/* 2. MIDDLE: Title & Chips */}
                <div className="relative z-10 flex-grow flex flex-col items-center text-center">
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div layoutId="logo-codeskill">
                      <Image src="/logo.svg" alt="CodeSkill Logo" height={32} width={32} unoptimized />
                    </motion.div>
                    <motion.h3 layoutId="title-codeskill" className="text-2xl font-black text-white tracking-tight">CodeSkill</motion.h3>
                  </div>
                  <h4 className="text-orange-300 font-bold text-base mb-1">AI Coding Interview Platform</h4>
                  <p className="text-gray-400 text-sm font-medium mb-6 max-w-[280px]">Master coding interviews with real-world challenges powered by AI.</p>

                  {/* Floating AI Chips */}
                  <div className="flex flex-wrap justify-center gap-3">
                    {codeSkillChips.map((chip, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: (i * 0.2) + 1, ease: "easeInOut" }}
                        className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full py-2 px-4 hover:bg-orange-500/30 hover:border-orange-500/50 transition-colors cursor-default backdrop-blur-md"
                      >
                        <chip.icon className="w-4 h-4 text-orange-400" />
                        <span className="text-sm font-semibold text-orange-100">{chip.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 3. BOTTOM: Premium CTA */}
                <PremiumShowcaseCTA
                  text="Launch CodeSkill"
                  layoutId="cta-codeskill"
                  colorFrom="from-orange-500"
                  colorTo="to-red-500"
                  glowColor="shadow-[0_0_30px_rgba(245,158,11,0.4)] group-hover:shadow-[0_0_60px_rgba(245,158,11,0.7)]"
                />
              </RippleContainer>
            </TiltCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
