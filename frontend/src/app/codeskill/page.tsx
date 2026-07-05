'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Brain, Code, Terminal, Trophy } from 'lucide-react';
import { PageTransitionLayout } from '@/components/PageTransitionLayout';
import { useCodeSkillTerminal } from '@/store/useCodeSkillTerminal';
import { cn } from '@/lib/utils';

export default function CodeSkillPage() {
  const codeLines = useCodeSkillTerminal();

  return (
    <PageTransitionLayout>
      <div className="min-h-screen bg-[#0B0F19] text-white">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Home</span>
          </Link>
        </nav>

        {/* Hero Section */}
        <main className="pt-32 pb-24 px-4 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              <motion.div layoutId="logo-codeskill">
                <Image src="/logo.svg" alt="CodeSkill Logo" height={48} width={48} unoptimized />
              </motion.div>
              <motion.h1 layoutId="title-codeskill" className="text-5xl md:text-6xl font-black text-white tracking-tight">CodeSkill</motion.h1>
            </div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl text-orange-400 font-bold mb-6"
            >
              AI Coding Interview Platform
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Master coding interviews with real-world challenges powered by AI. Experience realistic environments, instant feedback, and tailored learning paths.
            </motion.p>
            
            <motion.div layoutId="cta-codeskill" className="max-w-sm mx-auto lg:mx-0">
              <Link href="https://codeskill.evolvian.in/" target="_blank" className="block relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative h-16 w-full rounded-full flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg tracking-wide border border-white/20">
                  <Terminal className="w-5 h-5 mr-3" />
                  Launch CodeSkill
                </div>
              </Link>
            </motion.div>
          </div>

          <div className="flex-1 w-full max-w-2xl">
            <motion.div 
              layoutId="preview-codeskill" 
              className="relative w-full aspect-video bg-[#0B0F19]/80 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col"
            >
              {/* Window Header */}
              <div className="w-full h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              
              {/* Code Editor Body */}
              <div className="flex-1 p-6 font-mono text-sm md:text-base relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={codeLines}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {[
                      <span key="1"><span className="text-pink-500">const</span> <span className="text-yellow-400">solve</span> = <span className="text-blue-400">async</span> () {`=> {`}</span>,
                      <span key="2" className="ml-4"><span className="text-pink-500">return</span> <span className="text-green-400">"Success"</span></span>,
                      <span key="3">{`}`}</span>
                    ].slice(0, codeLines + 1).map((line, i) => (
                      <div key={i} className="mb-2">{line}</div>
                    ))}
                    {codeLines < 3 && (
                      <motion.div 
                        animate={{ opacity: [1, 0] }} 
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-2.5 h-5 bg-white/60 translate-y-1 ml-1"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Console Output */}
                {codeLines >= 3 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-6 left-6 w-64 bg-black/80 rounded-lg border border-white/10 p-3 shadow-xl"
                  >
                    <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
                      <Terminal className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-400">Console</span>
                    </div>
                    <div className="text-green-400 text-sm">$ node run.js</div>
                    <div className="text-gray-300 text-sm">{`> "Success"`}</div>
                    <div className="text-gray-500 text-xs mt-2">Execution time: 4ms</div>
                  </motion.div>
                )}

                {/* Floating Success Badge */}
                <motion.div
                  className="absolute bottom-6 right-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 shadow-[0_0_30px_rgba(245,158,11,0.6)] flex items-center justify-center z-20 border border-white/20"
                  animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Trophy className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransitionLayout>
  );
}
