'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Eye, 
  Database, 
  Lock, 
  Cookie, 
  UserCheck, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/premium-card';
import { Separator } from '@/components/ui/separator';

const sections = [
  {
    id: 'introduction',
    title: '1. Introduction',
    icon: Shield,
    content: 'Welcome to Verto. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you. By using Verto, you consent to the data practices described in this policy.'
  },
  {
    id: 'collection',
    title: '2. Information We Collect',
    icon: Database,
    content: 'We collect several different types of information for various purposes to provide and improve our service to you. This includes: \n\n• Personal identification information: name, email address, password.\n• Project and collaboration data: task titles, descriptions, assignees, deadlines, files and attachments you upload to the workspaces.\n• Usage data: log details, browser type, device details, and interaction metrics. \n\nWe do not collect any sensitive personal data (such as health status, political opinions, or religious beliefs).'
  },
  {
    id: 'usage',
    title: '3. How We Use Your Data',
    icon: Eye,
    content: 'Verto uses the collected data for various purposes, including:\n\n• To provide, maintain, and improve our project management service.\n• To notify you about changes to our service or workspace activities.\n• To allow you to participate in interactive features when you choose to do so.\n• To provide customer support and collect analysis to improve our workflows.\n• To detect, prevent, and address technical issues or project risks using Vetro AI Flow.'
  },
  {
    id: 'security',
    title: '4. Data Security',
    icon: Lock,
    content: 'The security of your data is of paramount importance to us. We implement industry-standard administrative, physical, and technical safeguards designed to protect your personal information from unauthorized access, use, alteration, or disclosure. All project and user authentication data is stored securely and encrypted in transit and at rest using modern secure protocols.'
  },
  {
    id: 'cookies',
    title: '5. Cookies & Tracking',
    icon: Cookie,
    content: 'We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.'
  },
  {
    id: 'rights',
    title: '6. Your Rights',
    icon: UserCheck,
    content: 'Under applicable privacy laws, you have rights including:\n\n• The right to access, update, or delete the information we have on you.\n• The right of rectification if the information is inaccurate or incomplete.\n• The right to object to our processing of your personal data.\n• The right to request data portability, allowing you to export your workspace data.\n\nTo exercise any of these rights, please contact our support team.'
  },
  {
    id: 'contact',
    title: '7. Contact Us',
    icon: Mail,
    content: 'If you have any questions about this Privacy Policy, our data practices, or your dealings with Verto, please contact us at:\n\nEmail: privacy@vertoflow.com\nAddress: Hitbullseye Engineering Division, 2026'
  }
];

export const PrivacyClient = () => {
  const [activeSection, setActiveSection] = useState('introduction');

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
            Privacy Policy
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed">
            Last Updated: June 23, 2026. This policy outlines our commitment to protecting your personal data, project details, and privacy workspace rights.
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
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Verto</span>
            <span>Plan. Predict. Deliver.</span>
          </div>
          <div className="flex items-center gap-x-6">
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/privacy" className="hover:underline text-indigo-600 dark:text-indigo-400 font-medium">Privacy Policy</Link>
          </div>
          <div>
            <span>Copyright © Hitbullseye 2026 | All Rights Reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
