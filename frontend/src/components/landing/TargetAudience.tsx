"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Code, Building2, Briefcase } from "lucide-react";
import { TiltCard } from "../ui/tilt-card";

const audiences = [
  {
    title: "Students",
    description: "Learn to code, track personal projects, and prepare for interviews.",
    icon: GraduationCap,
    color: "from-blue-400 to-indigo-500",
    iconColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    glowColor: "rgba(59, 130, 246, 0.3)"
  },
  {
    title: "Developers",
    description: "Manage sprints, conquer algorithm challenges, and upskill.",
    icon: Code,
    color: "from-orange-400 to-pink-500",
    iconColor: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    glowColor: "rgba(249, 115, 22, 0.3)"
  },
  {
    title: "Universities",
    description: "Host coding contests, track student progress, and grade automatically.",
    icon: Building2,
    color: "from-purple-400 to-violet-500",
    iconColor: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    glowColor: "rgba(168, 85, 247, 0.3)"
  },
  {
    title: "Companies",
    description: "Streamline tech hiring, manage engineering teams, and track velocity.",
    icon: Briefcase,
    color: "from-emerald-400 to-teal-500",
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    glowColor: "rgba(16, 185, 129, 0.3)"
  },
];

export function TargetAudience() {
  return (
    <section className="relative z-10 w-full py-24 px-4 border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-md"
          >
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Everyone.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium"
          >
            Whether you are just starting your journey or managing an enterprise engineering team, our platform adapts to your needs.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {audiences.map((audience, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="h-full"
            >
              <TiltCard intensity={15} glowColor={audience.glowColor} className="h-full rounded-[32px] p-[1px] bg-gradient-to-br from-white/10 to-transparent">
                <div className="bg-[#0B0F19]/90 backdrop-blur-3xl rounded-[31px] p-8 h-full flex flex-col items-start border border-white/5 shadow-2xl hover:shadow-[0_8px_40px_rgb(0,0,0,0.3)] transition-all duration-300 relative overflow-hidden group">
                  
                  {/* Glowing background gradient on hover */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${audience.color} opacity-30 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full blur-[60px] ${audience.bgColor} group-hover:scale-150 transition-transform duration-700 pointer-events-none`} />
                  
                  <div className={`w-14 h-14 rounded-2xl ${audience.bgColor} border ${audience.borderColor} flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                    <audience.icon className={`w-7 h-7 ${audience.iconColor}`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{audience.title}</h3>
                  <p className="text-gray-400 font-medium leading-relaxed">
                    {audience.description}
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
