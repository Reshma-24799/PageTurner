import React from 'react';
import { BookOpen, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg transition-colors duration-200">
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">PageTurner</h1>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-200 transition-colors duration-200">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;