import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-sage/30 dark:border-dark-border border-t-accent dark:border-t-accent rounded-full animate-spin mb-2"></div>
      <span className="text-primary dark:text-dark-text text-sm">Loading</span>
    </div>
  );
}