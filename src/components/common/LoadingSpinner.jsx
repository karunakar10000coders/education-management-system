import React from 'react';

export const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative w-10 h-10">
        <div className="w-10 h-10 rounded-full border-4 border-brand-200 dark:border-brand-900 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-4 border-brand-600 border-t-transparent animate-spin"></div>
      </div>
      {text && <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{text}</p>}
    </div>
  );
};
