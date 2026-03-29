import React from 'react';
import { cn } from '../lib/utils';

export const SectionHeader = ({ title, subtitle, centered = true, className }) => {
  return (
    <div className={cn(
      "mb-16 space-y-4",
      centered ? "text-center" : "text-left",
      className
    )}>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className={cn(
        "h-1.5 w-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600",
        centered ? "mx-auto" : "mr-auto"
      )} />
    </div>
  );
};
