import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = 'brand',
  description,
}) => {
  const colorMap = {
    brand: 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  };

  const isPositive = trend && trend > 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">{value}</h4>
        </div>
        {Icon && (
          <div className={clsx('p-3 rounded-xl', colorMap[color])}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(trend !== undefined || description) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend !== undefined && (
            <span
              className={clsx(
                'font-bold inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded',
                isPositive
                  ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'text-rose-700 bg-rose-100 dark:bg-rose-900/40 dark:text-rose-300'
              )}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? `+${trend}%` : `${trend}%`}
            </span>
          )}
          <span className="text-slate-500 dark:text-slate-400">{trendLabel || description}</span>
        </div>
      )}
    </div>
  );
};
