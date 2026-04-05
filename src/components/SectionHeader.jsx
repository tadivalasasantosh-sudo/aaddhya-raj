import React from 'react';
import { cn } from '../lib/utils';

export const SectionHeader = ({ title, subtitle, centered = true, className, dark = false }) => {
  return (
    <div className={cn(
      "mb-16 space-y-4",
      centered ? "text-center" : "text-left",
      className
    )}>
      <h2 className={cn(
        "text-3xl md:text-5xl font-bold tracking-tight",
        dark ? "text-white" : "text-gray-900"
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "text-lg max-w-2xl mx-auto font-light",
          dark ? "text-gray-400" : "text-gray-600"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
