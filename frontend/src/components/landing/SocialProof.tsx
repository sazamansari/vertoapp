"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

function Counter({ from = 0, to, duration = 2, suffix = "" }: { from?: number; to: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(to);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, from, to, duration]);

  const displayCount = to % 1 !== 0 ? (count / 10).toFixed(1) : count;

  return (
    <span ref={ref}>
      {displayCount}
      {suffix}
    </span>
  );
}

const stats = [
  { label: "Problems Solved", value: 100, suffix: "K+", color: "text-blue-400", glow: "shadow-[0_0_30px_rgba(96,165,250,0.3)]" },
  { label: "Developers", value: 50, suffix: "K+", color: "text-orange-400", glow: "shadow-[0_0_30px_rgba(251,146,60,0.3)]" },
  { label: "Teams", value: 1000, suffix: "+", color: "text-purple-400", glow: "shadow-[0_0_30px_rgba(192,132,252,0.3)]" },
  { label: "Uptime", value: 99.9, suffix: "%", color: "text-emerald-400", glow: "shadow-[0_0_30px_rgba(52,211,153,0.3)]", isFloat: true },
];

export function SocialProof() {
  return (
    <section className="relative z-10 w-full py-24 px-4 bg-[#0B0F19]/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto text-center">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-10"
        >
          TRUSTED BY
        </motion.p>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-24 opacity-60 transition-all duration-500 hover:opacity-100">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-xl md:text-2xl font-black tracking-tight text-white/50 hover:text-white transition-colors cursor-default">Students</motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-xl md:text-2xl font-black tracking-tight text-white/50 hover:text-white transition-colors cursor-default">Developers</motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-xl md:text-2xl font-black tracking-tight text-white/50 hover:text-white transition-colors cursor-default">Startups</motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="text-xl md:text-2xl font-black tracking-tight text-white/50 hover:text-white transition-colors cursor-default">Universities</motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
              className="group relative bg-[#0B0F19]/80 backdrop-blur-3xl rounded-[32px] p-8 md:p-10 border border-white/10 overflow-hidden"
            >
              {/* Subtle gradient hover fill */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className={`relative z-10 text-4xl md:text-5xl font-black mb-3 ${stat.color} drop-shadow-lg group-hover:${stat.glow} transition-shadow duration-500`}>
                <Counter 
                  from={0} 
                  to={stat.isFloat ? stat.value * 10 : stat.value} 
                  duration={2.5} 
                  suffix={stat.suffix} 
                />
              </div>
              <p className="relative z-10 text-gray-400 font-semibold tracking-wide uppercase text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
