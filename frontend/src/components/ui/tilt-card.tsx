"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useSpring, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glow?: boolean;
  glowColor?: string;
}

export function TiltCard({
  children,
  className,
  intensity = 15,
  glow = true,
  glowColor = "rgba(255, 255, 255, 0.15)",
  ...props
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  const [isHovered, setIsHovered] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const rotateX = useSpring(0, { stiffness: 300, damping: 30, mass: 1 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30, mass: 1 });

  // 8-second idle animation loop
  useEffect(() => {
    if (!isHovered) {
      controls.start({
        y: [0, -15, 0],
        rotateX: [0, 2, -2, 0],
        rotateY: [0, -2, 2, 0],
        transition: {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }
      });
    } else {
      controls.stop();
      controls.set({ y: 0 }); // reset y translation when hovered for accurate mouse tracking
    }
  }, [isHovered, controls]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    setMouseX(x);
    setMouseY(y);

    const centerX = width / 2;
    const centerY = height / 2;
    
    // Add extra 5 degree rotation on hover as requested
    const rotateXValue = ((y - centerY) / centerY) * -intensity - 5;
    const rotateYValue = ((x - centerX) / centerX) * intensity + 5;
    
    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      animate={controls}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative transition-all duration-500 ease-out z-10", className, isHovered && "scale-105 z-50")}
      {...(props as any)}
    >
      {/* Animated Glowing Border Outline */}
      <motion.div 
        className="absolute -inset-1 rounded-[inherit] opacity-0 blur-md transition-opacity duration-500 z-0 pointer-events-none"
        style={{
          background: `linear-gradient(45deg, ${glowColor}, transparent, ${glowColor})`
        }}
        animate={{
          opacity: isHovered ? 0.8 : 0.3,
          rotate: [0, 360],
        }}
        transition={{
          rotate: { duration: 8, repeat: Infinity, ease: "linear" }
        }}
      />
      
      {/* Deep Shadow on hover */}
      <div 
        className={cn(
          "absolute inset-0 rounded-[inherit] transition-shadow duration-500 pointer-events-none -z-10",
          isHovered ? "shadow-[0_30px_60px_-10px_rgba(0,0,0,0.3)]" : "shadow-lg"
        )}
      />

      {glow && (
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none rounded-[inherit]"
          style={{
            background: isHovered
              ? `radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 40%)`
              : "transparent",
          }}
          transition={{ duration: 0.3 }}
        />
      )}
      <div style={{ transform: "translateZ(40px)" }} className="relative z-10 w-full h-full">
        {children}
        
        {/* Particle bursts on hover */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{ backgroundColor: glowColor, top: mouseY, left: mouseX }}
                initial={{ opacity: 1, scale: 1 }}
                animate={{
                  opacity: 0,
                  scale: 0,
                  x: (Math.random() - 0.5) * 150,
                  y: (Math.random() - 0.5) * 150,
                }}
                transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
