import React, { useState, useEffect, useCallback } from 'react';
import {
  Settings,
  Moon,
  Sun,
  Wallet,
  Filter,
  RefreshCcw,
  Calendar,
  ArrowRight,
  Loader2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { Transaction, TransactionType, User } from './types';
import { getTheme, saveTheme } from './services/storage';
import { api } from './services/api';
import { authService } from './services/auth';
import { generateTransactionPDF } from './services/pdf';
import { formatCurrency } from './utils/formatters';
import { useTransactionData } from './hooks/useTransactionData';

// Modular Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';
import { StatsCard } from './components/StatsCard';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ExportModal } from './components/ExportModal';
import { LoginScreen } from './components/LoginScreen';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); 
  const [totalCount, setTotalCount] = useState(0);
  
  // Balance State
  const [globalTotalBalance, setGlobalTotalBalance] = useState(0);
  const [pageStartingBalance, setPageStartingBalance] = useState(0);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'data' | 'settings'>('dashboard');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getTheme());
  
  // Filter State
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [isExporting, setIsExporting] = useState(false);

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'primary' | 'danger';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'primary'
  });

  // Data Processing Hook
  const processedData = useTransactionData(transactions, pageStartingBalance);

  // Initialization
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    const savedTheme = getTheme();
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Main Data Fetcher
  const fetchData = useCallback(async (
    targetPage: number, 
    targetSize: number, 
    currentFilterType: 'ALL' | TransactionType,
    currentStartDate: string,
    currentEndDate: string
  ) => {
    setIsLoading(true);
    try {
      const summary = await api.getBalanceSummary();
      setGlobalTotalBalance(summary.balance);

      const { data, count } = await api.getTransactions(
        targetPage, 
        targetSize,
        currentFilterType,
        currentStartDate,
        currentEndDate
      );
      setTransactions(data);
      setTotalCount(count);

      let baseBalance = summary.balance; 
      const offset = (targetPage - 1) * targetSize;
      
      if (offset > 0) {
        const netChangeOfPreviousPages = await api.getNetChangeSum(
          offset, 
          currentFilterType, 
          currentStartDate, 
          currentEndDate
        );
        baseBalance = baseBalance - netChangeOfPreviousPages;
      }
      
      setPageStartingBalance(baseBalance);
      setPage(targetPage);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial Load & Filter Change Effect
  useEffect(() => {
    if (user) {
      setPage(1); 
      fetchData(1, pageSize, filterType, dateRange.start, dateRange.end);
    }
  }, [user, filterType, dateRange, pageSize, fetchData]); 

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalCount / pageSize)) {
      fetchData(newPage, pageSize, filterType, dateRange.start, dateRange.end);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
  };

  // Auth Handlers
  const handleLogin = async (username: string, pass: string) => {
    const userData = await authService.login(username, pass);
    setUser(userData);
  };

  const handleLogout = () => {
    setConfirmState({
      isOpen: true,
      title: 'Keluar Aplikasi?',
      message: 'Anda harus login kembali untuk mengakses data.',
      variant: 'primary',
      onConfirm: () => {
        authService.logout();
        setUser(null);
        setTransactions([]);
        setGlobalTotalBalance(0);
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        setActiveTab('dashboard');
      }
    });
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveTheme(newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  // CRUD
  const isAdmin = user?.role === 'admin';

  const handleAddTransaction = async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (!isAdmin) return;
    setIsLoading(true);
    try {
      await api.createTransaction(data);
      fetchData(1, pageSize, filterType, dateRange.start, dateRange.end);
    } catch (error) {
      alert('Gagal menyimpan data');
      setIsLoading(false);
    }
  };

  const handleEditTransaction = async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (!isAdmin || !editingTransaction) return;
    setIsLoading(true);
    try {
      await api.updateTransaction(editingTransaction.id, data);
      fetchData(page, pageSize, filterType, dateRange.start, dateRange.end);
    } catch (error) {
      alert('Gagal memperbarui data');
      setIsLoading(false);
    } finally {
      setEditingTransaction(undefined);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    if (!isAdmin) return;
    setConfirmState({
      isOpen: true,
      title: 'Hapus Data Transaksi?',
      message: 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
      variant: 'danger',
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await api.deleteTransaction(id);
          fetchData(page, pageSize, filterType, dateRange.start, dateRange.end);
        } catch (error) {
           alert('Gagal menghapus data');
           setIsLoading(false);
        } finally {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // Export
  const handleExportPDF = async (startDate: string, endDate: string, title: string) => {
    setIsExporting(true);
    try {
      const allData = await api.getAllTransactionsForExport(startDate || undefined, endDate || undefined);
      generateTransactionPDF({
        transactions: allData,
        startDate,
        endDate,
        title,
        user
      });
    } catch (error) {
      console.error(error);
      alert("Gagal mengunduh data untuk PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const resetFilters = () => {
    setFilterType('ALL');
    setDateRange({ start: '', end: '' });
  };

  const isFilterActive = filterType !== 'ALL' || dateRange.start !== '' || dateRange.end !== '';
  const totalPages = Math.ceil(totalCount / pageSize);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(page);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (!user) {
    return (
      <div className="font-sans text-slate-100 bg-slate-950 min-h-screen">
         <div className="absolute top-4 right-4 z-50">
           <button onClick={toggleTheme} className="p-2.5 rounded-xl text-slate-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow-sm">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
        </div>
        <LoginScreen onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans">
      
      {(isLoading || isExporting) && (
        <div className="fixed inset-0 z-[70] bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
          <div className="bg-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-3">
             <Loader2 className="animate-spin text-indigo-400" size={24} />
             <span className="font-medium text-slate-100">
               {isExporting ? 'Menyiapkan PDF...' : 'Memproses Data...'}
             </span>
          </div>
        </div>
      )}

      <Sidebar 
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Header 
          onOpenSidebar={() => setIsSidebarOpen(true)}
          activeTab={activeTab}
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenExport={() => setIsExportModalOpen(true)}
          onOpenForm={() => { setEditingTransaction(undefined); setIsFormOpen(true); }}
          isAdmin={isAdmin}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-slate-900 scroll-smooth">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <StatsCard title="Saldo Saat Ini" value={globalTotalBalance} icon={Wallet} variant="balance" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-100">Transaksi Terakhir</h3>
                  <button onClick={() => setActiveTab('data')} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium hover:underline">Lihat Semua</button>
                </div>
                <TransactionList transactions={processedData.allTransactionsWithBalance.slice(0, 5)} onEdit={() => {}} onDelete={() => {}} userRole="user" />
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
                
                {/* Header & Balance */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">Riwayat Lengkap</h2>
                    <p className="text-sm text-slate-400 mt-1">Daftar semua aktivitas keuangan yang tercatat.</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Total Saldo</span>
                    <p className={`text-3xl font-bold tracking-tight ${globalTotalBalance < 0 ? 'text-rose-500' : 'text-indigo-500'}`}>
                      {formatCurrency(globalTotalBalance)}
                    </p>
                  </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-slate-900 p-4 rounded-xl mb-6 border border-slate-700 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 text-sm font-semibold text-slate-400 focus:outline-none hover:text-indigo-400 transition-colors">
                      <Filter size={16} className="text-indigo-500" />
                      <span>Filter Data</span>
                      {isFilterOpen ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                    </button>
                    {isFilterActive && (
                      <button onClick={resetFilters} className="text-xs flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors">
                        <RefreshCcw size={12} /> Reset Filter
                      </button>
                    )}
                  </div>
                  
                  {isFilterOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="md:col-span-4">
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Jenis Transaksi</label>
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="w-full h-[42px] px-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                          <option value="ALL">Semua Transaksi</option>
                          <option value={TransactionType.INCOME}>Tagihan (Masuk)</option>
                          <option value={TransactionType.EXPENSE}>Kasbon (Keluar)</option>
                        </select>
                      </div>
                      <div className="md:col-span-8">
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Periode Waktu</label>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2">
                          <div className="relative flex-1 w-full">
                            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} className="w-full h-[42px] pl-10 pr-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                          </div>
                          <span className="hidden sm:block text-slate-400"><ArrowRight size={16} /></span>
                          <span className="sm:hidden text-slate-400 text-xs text-center font-medium">s/d</span>
                          <div className="relative flex-1 w-full">
                            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} className="w-full h-[42px] pl-10 pr-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                   {isFilterActive && (
                    <div className="mt-4 pt-4 border-t border-slate-700 flex flex-wrap gap-4 text-sm animate-in fade-in">
                      <span className="text-xs text-slate-500 self-center">Halaman ini:</span>
                      <div className="px-3 py-1 rounded-full bg-emerald-900/20 text-emerald-400 border border-emerald-800/30">
                        <span className="text-xs opacity-70">Masuk:</span> <strong>{formatCurrency(processedData.summary.income)}</strong>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-rose-900/20 text-rose-400 border border-rose-800/30">
                        <span className="text-xs opacity-70">Keluar:</span> <strong>{formatCurrency(processedData.summary.expense)}</strong>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-slate-700 text-slate-400">
                        <span className="text-xs opacity-70">Data:</span> <strong>{processedData.summary.count} transaksi</strong>
                      </div>
                    </div>
                  )}
                </div>
                
                <TransactionList 
                  transactions={processedData.filteredTransactions} 
                  onEdit={(t) => { setEditingTransaction(t); setIsFormOpen(true); }}
                  onDelete={handleDeleteTransaction}
                  userRole={user.role}
                />

                {/* Pagination Controls */}
                {totalCount > 0 && (
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-700">
                    <div className="text-sm text-slate-400 order-2 sm:order-1">
                      Menampilkan{' '}
                      <span className="font-semibold text-slate-100">{((page - 1) * pageSize) + 1}</span>
                      {' '}sampai{' '}
                      <span className="font-semibold text-slate-100">{Math.min(page * pageSize, totalCount)}</span>
                      {' '}dari{' '}
                      <span className="font-semibold text-slate-100">{totalCount}</span>
                      {' '}data
                    </div>

                    <div className="flex items-center gap-4 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
                      {!isFilterActive && (
                        <select
                          value={pageSize}
                          onChange={handlePageSizeChange}
                          className="h-9 px-2 rounded-lg border border-slate-700 bg-slate-800 text-sm text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value={10}>10 / halaman</option>
                          <option value={25}>25 / halaman</option>
                          <option value={50}>50 / halaman</option>
                          <option value={100}>100 / halaman</option>
                        </select>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 1}
                          className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={16} />
                        </button>

                        {!isFilterActive && (
                          <div className="hidden sm:flex items-center gap-1">
                            {getPageNumbers().map((p, idx) => (
                              <React.Fragment key={idx}>
                                {p === '...' ? (
                                  <span className="px-2 text-slate-500">...</span>
                                ) : (
                                  <button
                                    onClick={() => handlePageChange(p as number)}
                                    className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                                      page === p
                                        ? 'bg-indigo-600 text-white shadow-indigo-500/30'
                                        : 'text-slate-400 hover:bg-slate-700'
                                    }`}
                                  >
                                    {p}
                                  </button>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        )}

                        <div className={`flex items-center px-2 text-sm font-medium text-slate-400 ${!isFilterActive ? 'sm:hidden' : ''}`}>
                          {page} / {totalPages}
                        </div>

                        <button
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page === totalPages}
                          className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {activeTab === 'settings' && (
             <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-300">
              <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700"><h3 className="text-lg font-bold text-slate-100 flex items-center gap-2"><Settings className="w-5 h-5 text-slate-500" /> Preferensi Tampilan</h3></div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div><p className="font-medium text-slate-100 text-lg">Ubah Mode Gelap/Terang</p><p className="text-sm text-slate-400 mt-1">Sesuaikan tampilan antarmuka dengan kenyamanan mata Anda.</p></div>
                    <button onClick={toggleTheme} className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${theme === 'dark' ? 'bg-indigo-500' : 'bg-slate-600'}`}><span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`} /></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="h-10"></div>
        </div>
      </main>

      {/* Global Modals */}
      <TransactionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction} initialData={editingTransaction} />
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} onExport={handleExportPDF} />
      <ConfirmationModal isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} onConfirm={confirmState.onConfirm} onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))} variant={confirmState.variant} />
    </div>
  );
}

export default App;