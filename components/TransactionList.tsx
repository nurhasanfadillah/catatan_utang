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
      <div className="text-center py-20 bg-slate-800 rounded-xl border border-slate-700">
        <p className="text-slate-400">Belum ada data transaksi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {transactions.map((t) => (
          <div key={t.id} className="bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-700">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-full ${
                  t.type === TransactionType.INCOME
                    ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20'
                }`}>
                  {t.type === TransactionType.INCOME ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                </span>
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm line-clamp-1">{t.description}</h4>
                  <p className="text-xs text-slate-400">{formatDate(t.date)}</p>
                </div>
              </div>
              {canEdit && (
                <div className="flex gap-2">
                  <button onClick={() => onEdit(t)} className="p-1 text-slate-500 hover:text-indigo-400">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => onDelete(t.id)} className="p-1 text-slate-500 hover:text-rose-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
              <div>
                <p className="text-xs text-slate-400 mb-1">Nominal</p>
                <p className={`font-semibold font-mono ${
                  t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(t.amount)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-1">Saldo Akhir</p>
                <p className={`font-bold font-mono ${t.runningBalance < 0 ? 'text-rose-400' : 'text-slate-100'}`}>
                  {formatCurrency(t.runningBalance)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900">
              <tr>
                <th className="px-6 py-3 font-medium">Keterangan</th>
                <th className="px-6 py-3 font-medium text-center">Tanggal</th>
                <th className="px-6 py-3 font-medium text-right text-emerald-600">Tagihan (Masuk)</th>
                <th className="px-6 py-3 font-medium text-right text-rose-600">Diterima (Keluar)</th>
                <th className="px-6 py-3 font-medium text-right">Saldo</th>
                {canEdit && <th className="px-6 py-3 font-medium text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {transactions.map((t) => (
                <tr key={t.id} className="bg-slate-800 hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-100">
                    {t.description}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-400">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium font-mono text-emerald-600">
                    {t.type === TransactionType.INCOME ? formatCurrency(t.amount) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-medium font-mono text-rose-600">
                    {t.type === TransactionType.EXPENSE ? formatCurrency(t.amount) : '-'}
                  </td>
                  <td className={`px-6 py-4 text-right font-bold font-mono ${
                    t.runningBalance < 0 ? 'text-rose-400' : 'text-slate-100'
                  }`}>
                    {formatCurrency(t.runningBalance)}
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(t)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-700 hover:text-indigo-400 transition-all"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(t.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-700 hover:text-rose-400 transition-all"
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
