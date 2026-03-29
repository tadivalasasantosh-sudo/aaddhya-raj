import React from 'react';
import { cn } from '../lib/utils';

export const CompanyLogo = ({ className, size = 'md' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className={cn("flex items-center gap-2 group cursor-pointer", className)}>
      <div className={cn(
        "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 p-0.5 transition-transform group-hover:scale-110",
        sizes[size]
      )}>
        <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-black">
          <span className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-400">
            AR
          </span>
        </div>
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-tight text-white">AadhyaRaj</span>
        <span className="text-[10px] font-medium tracking-widest text-blue-400 uppercase">Technologies</span>
      </div>
    </div>
  );
};
