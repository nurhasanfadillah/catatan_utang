import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  X, 
  LogOut, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  toggleCollapse: () => void;
  activeTab: 'dashboard' | 'data' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'data' | 'settings') => void;
  user: User;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isCollapsed,
  toggleSidebar,
  toggleCollapse,
  activeTab,
  setActiveTab,
  user,
  onLogout
}) => {
  const isAdmin = user?.role === 'admin';

  return (
    <>
      {/* Sidebar Overlay (Mobile Only) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={toggleSidebar} 
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
        md:static
        ${isCollapsed ? 'w-20' : 'w-72'} 
        w-72 shadow-xl md:shadow-none
      `}>
        {/* Sidebar Header */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-6 h-20 border-b border-gray-100 dark:border-gray-700 relative`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30 flex-shrink-0">
              K
            </div>
            <div className={`transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight whitespace-nowrap">Keuangan</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Financial Manager</p>
            </div>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-gray-500 dark:text-gray-400">
            <X size={24} />
          </button>
        </div>

        {/* Desktop Collapse Button */}
        <button 
          onClick={toggleCollapse}
          className="hidden md:flex absolute -right-3 top-24 z-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 p-1.5 rounded-full shadow-sm hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="flex flex-col h-[calc(100%-5rem)] justify-between">
          <div className="p-4 space-y-2 mt-2">
            {(['dashboard', 'data', 'settings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); toggleSidebar(); }}
                className={`
                  flex items-center w-full gap-3 py-3.5 rounded-xl transition-all duration-200 group
                  ${isCollapsed ? 'justify-center px-0' : 'px-4'}
                  ${activeTab === tab ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300 font-semibold shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}
                `}
                title={isCollapsed ? (tab === 'data' ? 'Data Kasbon' : tab.charAt(0).toUpperCase() + tab.slice(1)) : ''}
              >
                {tab === 'dashboard' && <LayoutDashboard size={20} className="flex-shrink-0" />}
                {tab === 'data' && <FileText size={20} className="flex-shrink-0" />}
                {tab === 'settings' && <Settings size={20} className="flex-shrink-0" />}
                
                <span className={`capitalize whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                  {tab === 'data' ? 'Data Kasbon' : tab}
                </span>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
             <div className={`
               bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 mb-2 transition-all duration-200
               ${isCollapsed ? 'p-2 flex justify-center bg-transparent border-0' : 'p-3'}
             `}>
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md flex-shrink-0
                    ${isAdmin ? 'bg-gradient-to-br from-brand-500 to-indigo-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'}
                  `}>
                    {user.name.charAt(0)}
                  </div>
                  <div className={`flex-1 min-w-0 transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">{user.role}</p>
                  </div>
                </div>
             </div>
             <button 
                onClick={onLogout}
                className={`
                  w-full flex items-center gap-2 p-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors text-sm font-medium
                  ${isCollapsed ? 'justify-center' : 'justify-center'}
                `}
                title={isCollapsed ? "Keluar Aplikasi" : ""}
             >
                <LogOut size={16} /> 
                <span className={`transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>Keluar</span>
              </button>
          </div>
        </div>
      </aside>
    </>
  );
};