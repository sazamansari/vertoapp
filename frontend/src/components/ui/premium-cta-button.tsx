"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";

interface PremiumCTAProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export function PremiumCTAButton({
  children,
  variant = "primary",
  className,
  ...props
}: PremiumCTAProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseDown = () => setIsClicked(true);
  const handleMouseUp = () => {
    setIsClicked(false);
    // Trigger ripple flash if desired
  };

  if (variant === "secondary") {
    return (
      <motion.button
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "relative h-16 px-8 rounded-full flex items-center justify-center gap-2 overflow-hidden transition-all duration-300",
          "bg-white/80 backdrop-blur-md text-gray-900 font-semibold text-lg border border-gray-200/50 shadow-sm",
          "hover:border-transparent hover:text-indigo-900 group",
          className
        )}
        {...props}
      >
        {/* Hover Gradient Background Fill */}
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-100 opacity-0 transition-opacity duration-300 pointer-events-none z-0",
            isHovered && "opacity-100"
          )}
        />
        
        {/* Animated Gradient Border (Thin) */}
        <div 
          className={cn(
            "absolute inset-0 p-[1px] rounded-full opacity-0 transition-opacity duration-300 pointer-events-none z-0 overflow-hidden",
            isHovered && "opacity-100"
          )}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(99,102,241,0.5),transparent)] w-[200%] animate-[spin_3s_linear_infinite]" />
        </div>

        <span className="relative z-10 flex items-center gap-2">
          {children}
          <motion.div
            initial={{ opacity: 0, x: -10, width: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              x: isHovered ? 0 : -10,
              width: isHovered ? "auto" : 0
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden flex items-center"
          >
            <ArrowRight className="w-5 h-5 text-indigo-600" />
          </motion.div>
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative h-16 px-10 rounded-full flex items-center justify-center gap-3 overflow-hidden transition-all duration-300",
        "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg",
        "shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.8)] border border-white/10",
        className
      )}
      {...props}
    >
      {/* Animated gradient movement on hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-0 opacity-0 transition-opacity duration-500"
        animate={{ opacity: isHovered ? 1 : 0 }}
      />
      
      {/* Animated border shimmer/sweep */}
      <div className="absolute inset-0 rounded-full border border-white/20 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="w-[200%] h-full absolute top-0 -left-[100%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)]"
          animate={{ x: isHovered ? ["0%", "200%"] : "0%" }}
          transition={{ duration: 1.5, ease: "easeInOut", repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
        />
      </div>

      {/* Lightning particle burst / Ripple on click */}
      {isClicked && (
        <motion.div 
          className="absolute inset-0 z-20 bg-white rounded-full pointer-events-none"
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}

      {/* Particles around button on hover */}
      {isHovered && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white] z-0 pointer-events-none"
              initial={{ opacity: 1, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 60,
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut"
              }}
            />
          ))}
        </>
      )}

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-200" />
        {children}
        <motion.div
          animate={{ x: isHovered ? [0, 5, 0] : 0 }}
          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0, ease: "easeInOut" }}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.div>
      </span>
      
      {/* Glass reflection top highlight */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-80 z-10" />
    </motion.button>
  );
}
