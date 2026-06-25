'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Layers, 
  UserCheck, 
  ShieldCheck, 
  Cpu, 
  AlertTriangle, 
  Scale, 
  Mail, 
  ArrowLeft 
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/premium-card';
import { Separator } from '@/components/ui/separator';

const sections = [
  {
    id: 'agreement',
    title: '1. Agreement to Terms',
    icon: ShieldCheck,
    content: 'By accessing or using TaskOrbit, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site. These Terms of Service constitute a legally binding agreement between you and TaskOrbit concerning your access to and use of our platform.'
  },
  {
    id: 'service',
    title: '2. Description of Service',
    icon: Layers,
    content: 'TaskOrbit is an AI-powered project management and collaboration platform. It offers sprint planning, workload analysis, risk prediction, and collaboration dashboards. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time, including availability of features, databases, or contents, without prior notice.'
  },
  {
    id: 'obligations',
    title: '3. User Obligations',
    icon: UserCheck,
    content: 'As a user of TaskOrbit, you agree to use the service only for lawful purposes. You are prohibited from:\n\n• Uploading any contents that infringe intellectual property or privacy rights.\n• Attempting to disrupt, disable, or hack the security infrastructure of TaskOrbit.\n• Deploying automated scraping, crawling, or extraction scripts without authorization.\n• Sharing workspace invite codes or access credentials with unauthorized external parties.'
  },
  {
    id: 'account',
    title: '4. Registration & Security',
    icon: Cpu,
    content: 'To use certain features, you must register for an account. You agree to provide accurate, current, and complete registration details. You are solely responsible for maintaining the confidentiality of your password and account credentials, and you accept sole responsibility for all actions and activities that occur under your account.'
  },
  {
    id: 'intellectual',
    title: '5. Intellectual Property',
    icon: FileText,
    content: 'TaskOrbit and its original contents, logos, code, designs, features, and brand colors are and will remain the exclusive property of TaskOrbit and its licensors. Our trademarks, logos, and layouts may not be copied or used in connection with any third-party product or service without our prior written consent.'
  },
  {
    id: 'liability',
    title: '6. Limitation of Liability',
    icon: AlertTriangle,
    content: 'In no event shall TaskOrbit, nor its directors, employees, partners, agents, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of, or inability to access or use, the service.'
  },
  {
    id: 'governing',
    title: '7. Governing Law',
    icon: Scale,
    content: 'These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction of our company headquarters, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.'
  },
  {
    id: 'contact',
    title: '8. Contact Us',
    icon: Mail,
    content: 'If you have any questions or concerns regarding these Terms of Service, please reach out to us at:\n\nEmail: terms@taskorbit.com\nAddress: Hitbullseye Engineering Division, 2026'
  }
];

export const TermsClient = () => {
  const [activeSection, setActiveSection] = useState('agreement');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-indigo-500/30">
      {/* Dynamic Glow Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-500/5"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] dark:bg-purple-500/5"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/50 bg-white/70 backdrop-blur-md dark:border-neutral-800/50 dark:bg-neutral-950/70">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-x-4">
            <Button variant="ghost" className="gap-2 rounded-full" asChild>
              <Link href="/sign-up">
                <ArrowLeft className="size-4" />
                Back to Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4 backdrop-blur-sm">
            <FileText className="size-4" />
            Legal Center
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed">
            Last Updated: June 23, 2026. Please read these terms carefully before using the TaskOrbit platform and workspaces.
          </p>
        </motion.div>
      </section>

      {/* Main Layout */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-1 hidden lg:block sticky top-24 self-start space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 pl-3 mb-4">
            Table of Contents
          </p>
          <nav className="space-y-1">
            {sections.map((sect) => {
              const Icon = sect.icon;
              const isActive = activeSection === sect.id;
              return (
                <button
                  key={sect.id}
                  onClick={() => scrollToSection(sect.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  {sect.title}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Columns */}
        <div className="lg:col-span-3 space-y-8">
          {sections.map((sect, idx) => {
            const Icon = sect.icon;
            return (
              <motion.div
                key={sect.id}
                id={sect.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <PremiumCard className="hover:border-indigo-500/20 dark:hover:border-indigo-500/20 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 dark:bg-indigo-500/5">
                      <Icon className="size-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">{sect.title}</h2>
                  </div>
                  <Separator className="my-4 dark:bg-neutral-800" />
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                    {sect.content}
                  </p>
                </PremiumCard>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">TaskOrbit</span>
            <span>Plan. Predict. Deliver.</span>
          </div>
          <div className="flex items-center gap-x-6">
            <Link href="/terms" className="hover:underline text-indigo-600 dark:text-indigo-400 font-medium">Terms of Service</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>
          <div>
            <span>Copyright © Hitbullseye 2026 | All Rights Reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
