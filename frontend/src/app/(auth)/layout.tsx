'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { Sparkles, BrainCircuit, Activity, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const features = [
  {
    icon: Zap,
    title: 'AI Sprint Planning',
    desc: 'Generate sprint backlogs, estimates, and timelines automatically.'
  },
  {
    icon: ShieldAlert,
    title: 'AI Risk Prediction',
    desc: 'Identify delays, bottlenecks, and project risks before they happen.'
  },
  {
    icon: BrainCircuit,
    title: 'AI Workload Analysis',
    desc: 'Balance team capacity and prevent burnout with intelligent recommendations.'
  },
  {
    icon: Activity,
    title: 'AI Team Insights',
    desc: 'Track productivity, velocity, and team performance using AI-powered analytics.'
  }
];

export default function AuthLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSignIn = pathname === '/sign-in';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const callbackUrl = searchParams.get('callbackUrl');
  const targetPath = isSignIn ? '/sign-up' : '/sign-in';
  const targetUrl = callbackUrl ? `${targetPath}?callbackUrl=${encodeURIComponent(callbackUrl)}` : targetPath;

  return (
    <main className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* ─── Left Premium AI Panel ─── */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-10 text-white lg:flex lg:w-[50%] xl:w-[45%]"
      >
        {/* Floating Particles Background */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
          {mounted && [...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-indigo-500 blur-xl"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, 30, 0],
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col gap-12 h-full">
          {/* Logo with Glow */}
          <div className="relative inline-block w-fit">
            <div className="absolute -inset-2 rounded-full bg-indigo-500/20 blur-xl"></div>
            <Logo white />
          </div>

          <div className="flex-1 max-w-lg">
            <motion.div
              custom={0}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 backdrop-blur-sm"
            >
              <Sparkles className="size-4" />
              TaskOrbit
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="mb-4 text-4xl font-extrabold tracking-tight leading-tight md:text-5xl"
            >
              Plan. Predict. Deliver.
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="mb-10 text-lg text-indigo-200/80 leading-relaxed"
            >
              The AI-powered project management platform built for modern teams. Manage projects, predict delivery risks, optimize workloads, generate sprint plans, and accelerate team productivity with intelligent automation.
            </motion.p>

            <div className="space-y-6">
              {features.map((feat, idx) => (
                <motion.div 
                  key={feat.title}
                  custom={idx + 3} 
                  initial="hidden" 
                  animate="show" 
                  variants={fadeUp} 
                  className="flex items-start gap-4"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-sm">
                    <feat.icon className="size-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feat.title}</h3>
                    <p className="text-sm text-indigo-200/70">{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Premium Badges */}
          <motion.div
            custom={8}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-8 border-t border-indigo-500/20 pt-8"
          >
            <p className="mb-4 text-sm font-medium text-indigo-300">Trusted by modern engineering teams</p>
            <div className="flex flex-wrap gap-2">
              {['AI-Powered', 'Predictive Analytics', 'Smart Sprint Planning', 'Team Intelligence'].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-indigo-200 backdrop-blur-sm border border-white/10">
                  <CheckCircle2 className="size-3 text-indigo-400" />
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ─── Right Panel ─── */}
      <div className="flex flex-1 flex-col bg-white dark:bg-neutral-950">
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex items-center justify-between p-6 lg:justify-end"
        >
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="flex items-center gap-x-4">
            <span className="hidden text-sm text-neutral-500 dark:text-neutral-400 sm:block">
              {isSignIn ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <Button variant="outline" className="rounded-full font-medium shadow-sm" asChild>
              <Link href={targetUrl}>
                {isSignIn ? 'Create account' : 'Log in'}
              </Link>
            </Button>
          </div>
        </motion.nav>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeIn}
          className="flex flex-1 items-center justify-center p-4"
        >
          <div className="w-full max-w-[440px]">
            {children}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="p-6 text-center text-sm text-neutral-400 flex flex-col gap-1"
        >
          <span className="font-medium text-neutral-500 dark:text-neutral-300">Powered by TaskOrbit</span>
          <div className="flex items-center justify-center gap-x-4 text-xs text-neutral-400 dark:text-neutral-500 my-1">
            <Link href="/privacy" className="hover:underline hover:text-neutral-600 dark:hover:text-neutral-300">Privacy Policy</Link>
            <span className="size-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <Link href="/terms" className="hover:underline hover:text-neutral-600 dark:hover:text-neutral-300">Terms of Service</Link>
          </div>
          <span>Plan. Predict. Deliver.</span>
          <span className="mt-2 text-xs">Copyright © Hitbullseye 2026 | All Rights Reserved</span>
        </motion.div>
      </div>
    </main>
  );
}
