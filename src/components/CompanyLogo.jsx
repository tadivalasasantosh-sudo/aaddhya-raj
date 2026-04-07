import React, { useState } from 'react';
import { cn } from '../lib/utils';

export const CompanyLogo = ({ className, size = 'md' }) => {
  const [imgError, setImgError] = useState(false);
  const sizes = {
    sm: { icon: 'h-8 w-8', text1: 'text-lg', text2: 'text-[10px]' },
    md: { icon: 'h-12 w-12', text1: 'text-xl', text2: 'text-xs' },
    lg: { icon: 'h-16 w-16', text1: 'text-2xl', text2: 'text-sm' },
  };

  return (
    <div className={cn("flex items-center gap-3 group cursor-pointer", className)}>
      <div className={cn(
        "relative flex items-center justify-center transition-all duration-300 group-hover:scale-105",
        sizes[size].icon,
        "bg-transparent"
      )}>
        {!imgError ? (
          <img 
            src="/logo.jpg" 
            alt="AadhyaRaj Technologies Logo" 
            className="h-full w-full object-contain"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className={cn(
              "font-display font-bold tracking-tighter text-sky-400",
              size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : 'text-3xl'
            )}>
              AR
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col leading-none justify-center">
        <span className={cn("font-display font-bold tracking-tight text-gray-900", sizes[size].text1)}>AadhyaRaj</span>
        <span className={cn("font-sans font-medium tracking-[0.2em] text-sky-600 uppercase", sizes[size].text2)}>Technologies</span>
      </div>
    </div>
  );
};
