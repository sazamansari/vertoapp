'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Brain, Zap } from 'lucide-react';
import { PageTransitionLayout } from '@/components/PageTransitionLayout';
import { cn } from '@/lib/utils';

export default function TaskOrbitPage() {
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
              <motion.div layoutId="logo-taskorbit">
                <Image src="/icon.svg" alt="TaskOrbit Logo" height={48} width={48} unoptimized />
              </motion.div>
              <motion.h1 layoutId="title-taskorbit" className="text-5xl md:text-6xl font-black text-white tracking-tight">TaskOrbit</motion.h1>
            </div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl text-indigo-400 font-bold mb-6"
            >
              AI Project Management
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Predict delivery. Automate planning. Empower high-performing teams with the first intelligent project management platform that works as hard as you do.
            </motion.p>
            
            <motion.div layoutId="cta-taskorbit" className="max-w-sm mx-auto lg:mx-0">
              <Link href="/sign-in" className="block relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative h-16 w-full rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg tracking-wide border border-white/20">
                  <Zap className="w-5 h-5 mr-3" />
                  Launch TaskOrbit
                </div>
              </Link>
            </motion.div>
          </div>

          <div className="flex-1 w-full max-w-2xl">
            <motion.div 
              layoutId="preview-taskorbit" 
              className="relative w-full aspect-video bg-[#0B0F19]/50 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(79,70,229,0.2)] overflow-hidden flex flex-col justify-end p-6 md:p-8"
            >
              {/* Kanban Board Container */}
              <div className="flex gap-4 w-full h-[85%] items-end relative z-10">
                {[1, 2, 3].map((col, i) => (
                  <div key={i} className="flex-1 bg-white/5 rounded-xl p-3 flex flex-col gap-3 h-full">
                    <div className="w-12 h-2 bg-white/20 rounded-full mb-2" />
                    <motion.div 
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                      className="w-full h-12 bg-indigo-500/20 rounded-lg border border-indigo-500/30"
                    />
                    {i !== 2 && (
                      <motion.div 
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
                        className="w-full h-12 bg-white/5 rounded-lg border border-white/10"
                      />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Floating Robot Agent */}
              <motion.div
                className="absolute top-6 right-8 w-16 h-16 rounded-2xl bg-indigo-600 shadow-[0_0_30px_rgba(79,70,229,0.8)] flex items-center justify-center z-20 border border-white/20"
                animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransitionLayout>
  );
}
