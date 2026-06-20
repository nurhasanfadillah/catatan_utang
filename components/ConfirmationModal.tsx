import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'primary' | 'warning';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  onConfirm,
  onCancel,
  variant = 'primary'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl transform transition-all scale-100 border border-slate-700 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-6 text-center">
          <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-5 ${
            variant === 'danger' ? 'bg-rose-900/30 text-rose-400' :
            variant === 'warning' ? 'bg-amber-900/30 text-amber-400' :
            'bg-indigo-500/20 text-indigo-400'
          }`}>
            {variant === 'danger' ? <AlertTriangle size={28} /> :
             variant === 'warning' ? <AlertTriangle size={28} /> :
             <CheckCircle size={28} />}
          </div>
          <h3 id="modal-title" className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">{message}</p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 transition-colors focus:ring-2 focus:ring-slate-600"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium shadow-lg transition-all active:scale-95 focus:ring-2 focus:ring-offset-2 ${
                variant === 'danger'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30 focus:ring-rose-500'
                  : 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-indigo-500/30 focus:ring-indigo-500'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
