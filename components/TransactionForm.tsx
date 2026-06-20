import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { X } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
  initialData?: Transaction;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDescription(initialData.description);
        setAmount(initialData.amount.toString());
        setDate(initialData.date);
        setType(initialData.type);
      } else {
        setDescription('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setType(TransactionType.EXPENSE);
      }
      setShowConfirm(false);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmSubmit = () => {
    onSubmit({
      description,
      amount: parseFloat(amount),
      date,
      type
    });
    setShowConfirm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
          <div className="flex justify-between items-center p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold text-slate-100">
              {initialData ? 'Edit Data' : 'Tambah Data Baru'}
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="overflow-y-auto p-6">
            <form id="transaction-form" onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Tanggal Transaksi</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-600 bg-slate-700/50 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Jenis Transaksi</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType(TransactionType.INCOME)}
                    className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                      type === TransactionType.INCOME
                        ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-300'
                        : 'bg-slate-700/30 text-slate-400 border-2 border-transparent hover:bg-slate-700'
                    }`}
                  >
                    <span>Tagihan (Masuk)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType(TransactionType.EXPENSE)}
                    className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                      type === TransactionType.EXPENSE
                        ? 'bg-rose-50 text-rose-700 border-2 border-rose-500 dark:bg-rose-900/20 dark:text-rose-300'
                        : 'bg-slate-700/30 text-slate-400 border-2 border-transparent hover:bg-slate-700'
                    }`}
                  >
                    <span>Kasbon (Keluar)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Keterangan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembayaran Invoice #001"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-600 bg-slate-700/50 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Nominal (Rp)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-600 bg-slate-700/50 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="p-6 border-t border-slate-700 bg-slate-900/50 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              form="transaction-form"
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium shadow-lg shadow-indigo-500/30 transition-all transform active:scale-95"
            >
              {initialData ? 'Simpan Perubahan' : 'Simpan Data'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        title={initialData ? "Simpan Perubahan?" : "Simpan Data Baru?"}
        message={initialData
          ? "Anda akan memperbarui data transaksi ini. Pastikan informasi sudah benar."
          : "Anda akan menambahkan data transaksi baru ke dalam sistem. Lanjutkan?"}
        confirmLabel="Ya, Simpan"
        variant="primary"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};
