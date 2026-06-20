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

const variantConfig: Record<StatsCardVariant, { container: string; icon: string }> = {
  balance: { container: 'bg-brand-500/10', icon: 'text-brand-500' },
  income:  { container: 'bg-emerald-500/10', icon: 'text-emerald-500' },
  expense: { container: 'bg-rose-500/10', icon: 'text-rose-500' },
};

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, variant }) => {
  const { container, icon } = variantConfig[variant];
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
            {formatCurrency(value)}
          </h3>
        </div>
        <div className={`p-3 rounded-lg ${container}`}>
          <Icon className={`w-6 h-6 ${icon}`} />
        </div>
      </div>
    </div>
  );
};
