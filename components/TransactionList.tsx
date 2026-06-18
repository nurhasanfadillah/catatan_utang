import React from 'react';
import { TransactionWithBalance, TransactionType, Transaction, UserRole } from '../types';
import { Edit2, Trash2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

interface TransactionListProps {
  transactions: TransactionWithBalance[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  userRole: UserRole;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete, userRole }) => {
  const canEdit = userRole === 'admin';

  if (transactions.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">Belum ada data transaksi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {transactions.map((t) => (
          <div key={t.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-full ${
                  t.type === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  {t.type === TransactionType.INCOME ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">{t.description}</h4>
                  <p className="text-xs text-gray-500">{formatDate(t.date)}</p>
                </div>
              </div>
              {canEdit && (
                <div className="flex gap-2">
                  <button onClick={() => onEdit(t)} className="p-1 text-gray-400 hover:text-brand-600">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => onDelete(t.id)} className="p-1 text-gray-400 hover:text-rose-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">Nominal</p>
                <p className={`font-semibold ${
                  t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(t.amount)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Saldo Akhir</p>
                <p className={`font-bold ${t.runningBalance < 0 ? 'text-rose-500' : 'text-gray-900 dark:text-white'}`}>
                  {formatCurrency(t.runningBalance)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 font-medium">Keterangan</th>
                <th className="px-6 py-3 font-medium text-center">Tanggal</th>
                <th className="px-6 py-3 font-medium text-right text-emerald-600">Tagihan (Masuk)</th>
                <th className="px-6 py-3 font-medium text-right text-rose-600">Diterima (Keluar)</th>
                <th className="px-6 py-3 font-medium text-right">Saldo</th>
                {canEdit && <th className="px-6 py-3 font-medium text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((t) => (
                <tr key={t.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {t.description}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-emerald-600">
                    {t.type === TransactionType.INCOME ? formatCurrency(t.amount) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-rose-600">
                    {t.type === TransactionType.EXPENSE ? formatCurrency(t.amount) : '-'}
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${
                    t.runningBalance < 0 ? 'text-rose-500' : 'text-gray-900 dark:text-white'
                  }`}>
                    {formatCurrency(t.runningBalance)}
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => onEdit(t)}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:hover:bg-gray-700 transition-all"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(t.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-rose-600 dark:hover:bg-gray-700 transition-all"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};