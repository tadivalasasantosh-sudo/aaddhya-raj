import React from 'react';
import { cn } from '../lib/utils';

export const SectionHeader = ({ title, subtitle, centered = true, className }) => {
  return (
    <div className={cn(
      "mb-16 space-y-4",
      centered ? "text-center" : "text-left",
      className
    )}>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-50">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light">
          {subtitle}
        </p>
      )}
      <div className={cn(
        "h-1 w-20 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
        centered ? "mx-auto" : "mr-auto"
      )} />
    </div>
  );
};
