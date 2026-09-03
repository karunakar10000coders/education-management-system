import React from 'react';
import { clsx } from 'clsx';

export const Input = React.forwardRef(({
  label,
  error,
  icon: Icon,
  helperText,
  className = '',
  required = false,
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={clsx(
            'block w-full text-sm rounded-lg border transition-colors focus:ring-2 focus:ring-offset-0 disabled:bg-slate-100 disabled:cursor-not-allowed dark:bg-slate-800 dark:text-slate-100',
            Icon ? 'pl-9 pr-3' : 'px-3',
            'py-2',
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900'
              : 'border-slate-300 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500/20 text-slate-900',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
