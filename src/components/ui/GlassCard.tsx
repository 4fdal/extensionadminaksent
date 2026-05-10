import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
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
    "glass glass-shadow rounded-2xl p-4 transition-all duration-300",
    hoverScale && "hover:scale-[1.02] hover:bg-white/80 hover:border-white/90 hover:shadow-lg hover:shadow-blue-400/20",
    className
  );

  return (
    <div
      className={baseClasses}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;

