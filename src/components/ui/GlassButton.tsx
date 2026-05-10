import React from 'react';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const GlassButton: React.FC<GlassButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-[#60A5FA] to-[#38BDF8] text-white shadow-lg shadow-primary/30 hover:shadow-primary/50",
    secondary: "bg-white/40 text-slate-700 hover:bg-white/60 border border-white/50",
    ghost: "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-white/40",
    danger: "bg-red-50 text-red-500 border border-red-200 hover:bg-red-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-8 py-4 text-base rounded-2xl",
  };

  return (
    <button
      className={cn(
        "font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default GlassButton;
