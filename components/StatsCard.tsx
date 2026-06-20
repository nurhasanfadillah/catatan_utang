import React from 'react';
import { LucideIcon } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

type StatsCardVariant = 'balance' | 'income' | 'expense';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: StatsCardVariant;
}

const variantConfig: Record<StatsCardVariant, {
  wrapper: string;
  titleColor: string;
  valueColor: string;
  valueSize: string;
  iconBg: string;
  iconColor: string;
}> = {
  balance: {
    wrapper: 'bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-700 shadow-lg shadow-indigo-500/25',
    titleColor: 'text-indigo-100',
    valueColor: 'text-white',
    valueSize: 'text-4xl',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
  },
  income: {
    wrapper: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-emerald-500',
    titleColor: 'text-slate-500 dark:text-slate-400',
    valueColor: 'text-slate-900 dark:text-white',
    valueSize: 'text-2xl',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
  },
  expense: {
    wrapper: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-rose-500',
    titleColor: 'text-slate-500 dark:text-slate-400',
    valueColor: 'text-slate-900 dark:text-white',
    valueSize: 'text-2xl',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-500',
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, variant }) => {
  const { wrapper, titleColor, valueColor, valueSize, iconBg, iconColor } = variantConfig[variant];
  return (
    <div className={`rounded-xl p-6 ${wrapper}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${titleColor}`}>{title}</p>
          <h3 className={`font-bold mt-2 ${valueColor} ${valueSize}`}>
            {formatCurrency(value)}
          </h3>
        </div>
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};
