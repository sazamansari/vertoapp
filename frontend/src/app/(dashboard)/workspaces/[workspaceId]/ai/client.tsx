'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { AiChat } from '@/features/ai/components/ai-chat';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export const AiClient = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex h-full flex-col gap-8"
    >
      {/* Premium Hero Section */}
      <motion.div 
        variants={itemVariants} 
        className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-transparent p-10 text-center dark:border-indigo-500/10 dark:from-indigo-600/20"
      >
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <Sparkles className="size-8" />
          </div>
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Evolvian AI Flow
          </h1>
          <h2 className="mb-6 text-xl font-medium text-indigo-600 dark:text-indigo-400 md:text-2xl">
            Plan. Predict. Deliver.
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Let AI help your team identify risks, optimize workloads, generate tasks, plan sprints, and improve delivery performance.
          </p>
        </div>
      </motion.div>

      {/* AI Chat Interface */}
      <motion.div variants={itemVariants} className="mx-auto w-full max-w-4xl">
        <AiChat />
      </motion.div>

    </motion.div>
  );
};
