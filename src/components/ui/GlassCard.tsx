import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  animate?: boolean;
  hoverScale?: boolean;
  delay?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  animate = true, 
  hoverScale = true,
  delay = 0, 
  ...props 
}) => {
  const baseClasses = cn(
    "glass glass-shadow rounded-2xl p-4 transition-all duration-500",
    className
  );


  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20, scale: 0.95 } : false}
      animate={animate ? { opacity: 1, y: 0, scale: 1 } : false}
      whileHover={hoverScale ? { 
        scale: 1.02, 
        backgroundColor: "rgba(255, 255, 255, 0.12)",
        borderColor: "rgba(255, 255, 255, 0.25)" 
      } : {}}
      transition={{ 
        duration: 0.4, 
        delay,
        ease: [0.23, 1, 0.32, 1] 
      }}
      className={baseClasses}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;

