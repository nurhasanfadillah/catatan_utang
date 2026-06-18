import React from 'react';
import { Menu, Moon, Sun, FileDown, Plus } from 'lucide-react';
import { Theme } from '../types';

interface HeaderProps {
  onOpenSidebar: () => void;
  activeTab: 'dashboard' | 'data' | 'settings';
  theme: Theme;
  toggleTheme: () => void;
  onOpenExport: () => void;
  onOpenForm: () => void;
  isAdmin: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  activeTab,
  theme,
  toggleTheme,
  onOpenExport,
  onOpenForm,
  isAdmin
}) => {
  return (
    <header className="h-20 flex items-center justify-between px-6 md:px-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <button onClick={onOpenSidebar} className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white capitalize">
            {activeTab === 'dashboard' ? 'Dashboard Overview' : activeTab === 'data' ? 'Manajemen Data' : 'Pengaturan Sistem'}
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
            {activeTab === 'dashboard' 
              ? 'Ringkasan performa keuangan produksi.' 
              : activeTab === 'data' 
                ? 'Kelola data pemasukan dan pengeluaran.' 
                : 'Konfigurasi preferensi aplikasi.'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <button onClick={toggleTheme} className="p-2.5 rounded-xl text-gray-500 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-600 hidden sm:flex">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <button onClick={onOpenExport} className="flex items-center justify-center p-2.5 sm:px-4 sm:py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
          <FileDown size={20} />
          <span className="hidden sm:inline ml-2 font-medium">Ekspor</span>
        </button>

        {isAdmin && (
          <button onClick={onOpenForm} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 sm:px-5 rounded-xl text-sm font-medium shadow-lg shadow-brand-500/20 transition-all hover:scale-105 active:scale-95">
            <Plus size={20} />
            <span className="hidden sm:inline">Tambah Data</span>
          </button>
        )}
      </div>
    </header>
  );
};