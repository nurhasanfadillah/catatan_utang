import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldAlert } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(username, password);
  };

  const performLogin = async (u: string, p: string) => {
    setError('');
    setIsLoading(true);
    try {
      await onLogin(u, p);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-indigo-500/40 mx-auto mb-4">
              K
            </div>
            <h1 className="text-2xl font-bold text-white">Selamat Datang</h1>
            <p className="text-slate-400 mt-2">Masuk untuk mengakses Keuangan Produksi</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                    placeholder="Masukkan username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                    placeholder="Masukkan password"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'Memproses...' : (
                  <>
                    Masuk Sistem <ArrowRight size={18} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => performLogin('admin', 'root')}
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-slate-700 rounded-xl shadow-sm text-sm font-medium text-slate-400 bg-slate-700 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all"
              >
                <ShieldAlert size={16} className="text-amber-500" />
                Akses Masuk Paksa (Dev Mode)
              </button>
            </div>
          </form>
        </div>
        <div className="bg-slate-800 px-8 py-4 border-t border-slate-700 text-center">
          <p className="text-xs text-slate-500">
            &copy; 2025 PT. Redone Berkah Mandiri Utama
          </p>
        </div>
      </div>
    </div>
  );
};
