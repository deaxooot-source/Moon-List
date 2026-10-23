import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  const isDark = theme === 'dark';

  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] transition-colors">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Name: Moon List - purely clean typography, no logos or moon graphics */}
        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sans select-none">
          Moon<span className="text-blue-600 dark:text-blue-500">List</span>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={onToggleTheme}
          type="button"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 dark:bg-[#0d1527] dark:hover:bg-[#131e36] dark:text-slate-200 dark:border-slate-700 active:scale-95"
          title={isDark ? 'التبديل إلى نمط الأزرق والأبيض' : 'التبديل إلى نمط الأزرق والأسود'}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>أزرق وأبيض</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-blue-600" />
              <span>أزرق وأسود</span>
            </>
          )}
        </button>

      </div>
    </header>
  );
};
