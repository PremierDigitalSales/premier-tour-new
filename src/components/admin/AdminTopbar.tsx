import React from 'react';
import { Menu, Bell, User, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminTopbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0C0B0A]/90 backdrop-blur-md border-b border-[#E8E0D2] dark:border-[var(--border-subtle)] h-16 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-[#4A453D] dark:text-[#D9D2C5] hover:text-[#A97F3E] dark:hover:text-white rounded-xl hover:bg-[#F4EFE6] dark:hover:bg-[#1A1815] transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="hidden sm:inline-block text-xs font-bold text-[#857D70] dark:text-[#A39A8B] uppercase tracking-wider">
          Premier Tours Admin Management
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="btn-glass px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 text-[#4A453D] dark:text-white"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">View Live Website</span>
        </Link>

        <Link 
          to="/dashboard" 
          className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-[#0C0B0A]/60 border border-emerald-200 dark:border-[var(--border-subtle)] flex items-center justify-center text-[#A97F3E] dark:text-[#D9BC7E] transition-transform hover:scale-105"
          title="Switch to Traveler Dashboard"
        >
          <User className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};
