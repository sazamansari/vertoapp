"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function BackgroundEffects() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#0B0F19]">
      {/* Aurora Gradients Base */}
      <motion.div
        className="absolute inset-0 opacity-50 mix-blend-screen"
        style={{
          background: "radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.4) 0%, transparent 40%), radial-gradient(ellipse at bottom right, rgba(245, 158, 11, 0.4) 0%, transparent 40%)"
        }}
        animate={{
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Massive Moving Blobs */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] rounded-full mix-blend-screen blur-[140px]"
        style={{ background: "radial-gradient(circle, #4F46E5, #9333EA)" }}
        animate={{
          x: [0, 80, -40, 0],
          y: [0, 50, -80, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] rounded-full mix-blend-screen blur-[140px]"
        style={{ background: "radial-gradient(circle, #F59E0B, #E11D48)" }}
        animate={{
          x: [0, -80, 50, 0],
          y: [0, -60, 90, 0],
          scale: [1, 1.3, 0.7, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Neural Network SVG Lines Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <pattern id="neural-net" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="2" fill="#FFF"/>
          <circle cx="80" cy="80" r="2" fill="#FFF"/>
          <line x1="20" y1="20" x2="80" y2="80" stroke="#FFF" strokeWidth="1"/>
          <line x1="20" y1="20" x2="120" y2="-20" stroke="#FFF" strokeWidth="1"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#neural-net)"/>
      </svg>

      {/* Tiny Glowing Dots (Stars/Data points) */}
      {mounted && [...Array(20)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 3 + 1 + "px",
            height: Math.random() * 3 + 1 + "px",
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            boxShadow: "0 0 10px rgba(255,255,255,0.8)",
          }}
          animate={{
            opacity: [0, Math.random() * 0.8 + 0.2, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Floating Glass Circles */}
      {mounted && [...Array(5)].map((_, i) => (
        <motion.div
          key={`glass-${i}`}
          className="absolute rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl"
          style={{
            width: Math.random() * 150 + 50 + "px",
            height: Math.random() * 150 + 50 + "px",
            left: Math.random() * 80 + 10 + "%",
            top: Math.random() * 80 + 10 + "%",
          }}
          animate={{
            y: [0, -50, 0],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Thunder Flash / Lightning Effects */}
      <motion.div
        className="absolute inset-0 bg-[#3B82F6] mix-blend-color-dodge pointer-events-none"
        animate={{ opacity: [0, 0, 0.15, 0, 0, 0.05, 0, 0] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          times: [0, 0.4, 0.42, 0.44, 0.8, 0.82, 0.84, 1],
        }}
      />
      
      <motion.div
        className="absolute inset-0 bg-[#F59E0B] mix-blend-color-dodge pointer-events-none"
        animate={{ opacity: [0, 0, 0, 0, 0.1, 0, 0, 0] }}
        transition={{
          duration: 15,
          repeat: Infinity,
          times: [0, 0.6, 0.62, 0.64, 0.7, 0.72, 0.74, 1],
        }}
      />
    </div>
  );
}
