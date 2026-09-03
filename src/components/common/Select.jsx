import React from 'react';
import { clsx } from 'clsx';

export const Select = React.forwardRef(({
  label,
  options = [],
  error,
  helperText,
  required = false,
  className = '',
  placeholder = 'Select option...',
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
        <select
          ref={ref}
          className={clsx(
            'block w-full text-sm rounded-lg border transition-colors focus:ring-2 focus:ring-offset-0 px-3 py-2 bg-white dark:bg-slate-800 dark:text-slate-100',
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-300 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500/20',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt, idx) => {
            const isObj = typeof opt === 'object';
            const value = isObj ? opt.value : opt;
            const labelText = isObj ? opt.label : opt;
            return (
              <option key={idx} value={value}>
                {labelText}
              </option>
            );
          })}
        </select>
      </div>
      {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
});

Select.displayName = 'Select';
