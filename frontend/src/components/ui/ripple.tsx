'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, MouseEvent } from 'react';

interface RippleType {
  x: number;
  y: number;
  id: number;
}

export function RippleContainer({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const [ripples, setRipples] = useState<RippleType[]>([]);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      x,
      y,
      id: Date.now()
    };
    
    setRipples(prev => [...prev, newRipple]);
  };

  return (
    <div className={`relative overflow-hidden cursor-pointer ${className}`} onClick={handleClick}>
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ top: ripple.y, left: ripple.x, width: 0, height: 0, opacity: 0.5 }}
            animate={{ width: 500, height: 500, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onAnimationComplete={() => {
              setRipples(prev => prev.filter(r => r.id !== ripple.id));
            }}
            className="absolute rounded-full bg-white/20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-50 mix-blend-overlay"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
