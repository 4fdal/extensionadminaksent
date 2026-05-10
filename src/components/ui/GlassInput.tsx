import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

const GlassInput: React.FC<GlassInputProps> = ({ 
  className, 
  label, 
  icon,
  ...props 
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-xs font-medium text-slate-400 ml-1">{label}</label>}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white",
            "placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
            "transition-all duration-200",
            icon && "pl-10",
            className
          )}
          {...props}
        />

      </div>
    </div>
  );
};

export default GlassInput;
export { cn };
