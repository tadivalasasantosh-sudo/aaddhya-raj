import React from 'react';
import { cn } from '../lib/utils';

export const CompanyLogo = ({ className, size = 'md' }) => {
  const sizes = {
    sm: { icon: 'h-8 w-8', text1: 'text-lg', text2: 'text-[10px]' },
    md: { icon: 'h-12 w-12', text1: 'text-xl', text2: 'text-xs' },
    lg: { icon: 'h-16 w-16', text1: 'text-2xl', text2: 'text-sm' },
  };

  return (
    <div className={cn("flex items-center gap-3 group cursor-pointer", className)}>
      <div className={cn(
        "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 p-0.5 transition-transform group-hover:scale-110",
        sizes[size].icon
      )}>
        <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-black">
          <span className={cn(
            "font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-400",
            size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : 'text-3xl'
          )}>
            AR
          </span>
        </div>
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />
      </div>
      <div className="flex flex-col leading-none justify-center">
        <span className={cn("font-bold tracking-tight text-white", sizes[size].text1)}>Aadhyaraj</span>
        <span className={cn("font-medium tracking-widest text-blue-400 uppercase", sizes[size].text2)}>Technologies</span>
      </div>
    </div>
  );
};
