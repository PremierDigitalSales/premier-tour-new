import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Heart,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Moon,
  Sun,
  LogOut,
  Sparkles,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { CurrencyCode } from '../types';
import { SafeImage } from './ui/SafeImage';

export const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, role, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const { t, language, setLanguage, availableLanguages } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  if (!user) return null;

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    navigate('/');
  };

  const getAvatarInitials = () => {
    if (user.full_name) {
      const parts = user.full_name.split(' ');
      if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
      return parts[0][0].toUpperCase();
    }
    return 'U';
  };

  const displayName = user.full_name || user.email?.split('@')[0] || 'Traveler';

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-2 py-1.5 pr-3.5 bg-white dark:bg-[var(--surface)] rounded-full border border-[#E8E0D2] dark:border-[var(--border-subtle)] shadow-xs hover:border-[#A97F3E] dark:hover:border-[#D9BC7E] transition-all group focus:outline-none focus:ring-2 focus:ring-[#A97F3E]/20"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <div className="w-8 h-8 rounded-full border border-[#A97F3E]/30 overflow-hidden bg-[#F4EFE6] dark:bg-[var(--surface)] flex items-center justify-center shrink-0">
          {user.avatar_url ? (
            <SafeImage src={user.avatar_url} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-[#A97F3E] dark:text-[#D9BC7E]">{getAvatarInitials()}</span>
          )}
        </div>
        <span className="text-xs font-bold text-[#1A1814] dark:text-[#F7F3EA] max-w-[120px] truncate">{displayName}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#A97F3E] dark:text-[#D9BC7E] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-72 bg-white dark:bg-[var(--surface)] border border-[#E8E0D2] dark:border-[var(--border-subtle)] rounded-2xl shadow-xl overflow-hidden z-[100]"
          >
            {/* Header info */}
            <div className="p-4 flex items-center gap-3 border-b border-[#E8E0D2] dark:border-[var(--border-subtle)] bg-[#FAF7F2] dark:bg-[#161412]/60">
              <div className="w-11 h-11 rounded-full border-2 border-[#A97F3E]/30 overflow-hidden bg-white dark:bg-[var(--surface)] shrink-0 flex items-center justify-center">
                {user.avatar_url ? (
                  <SafeImage src={user.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-[#A97F3E] dark:text-[#D9BC7E]">{getAvatarInitials()}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#1A1814] dark:text-[#F7F3EA] truncate">{displayName}</h3>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#A97F3E] shrink-0" />
                </div>
                <p className="text-xs text-[#857D70] dark:text-[#A39A8B] truncate">{user.email}</p>
              </div>
            </div>

            {/* Main Navigation Links */}
            <div className="p-2 space-y-0.5">
              <Link
                to="/dashboard?tab=bookings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#1A1814] dark:text-[#F7F3EA] hover:bg-[#F4EFE6] dark:hover:bg-[#1A1815] transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#A97F3E] dark:text-[#D9BC7E]" />
                <span>{t('nav_bookings') || 'My Bookings'}</span>
              </Link>

              <Link
                to="/tours"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#1A1814] dark:text-[#F7F3EA] hover:bg-[#F4EFE6] dark:hover:bg-[#1A1815] transition-colors"
              >
                <Heart className="w-4 h-4 text-[#A97F3E] dark:text-[#D9BC7E]" />
                <span>{t('nav_wishlist') || 'Wishlist'}</span>
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#1A1814] dark:text-[#F7F3EA] hover:bg-[#F4EFE6] dark:hover:bg-[#1A1815] transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-[#A97F3E] dark:text-[#D9BC7E]" />
                <span>{t('nav_dashboard') || 'My Dashboard'}</span>
              </Link>

              <Link
                to="/dashboard?tab=settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#1A1814] dark:text-[#F7F3EA] hover:bg-[#F4EFE6] dark:hover:bg-[#1A1815] transition-colors"
              >
                <Settings className="w-4 h-4 text-[#A97F3E] dark:text-[#D9BC7E]" />
                <span>{t('nav_settings') || 'Profile Settings'}</span>
              </Link>

              {/* Admin Panel Link */}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#A97F3E]/10 dark:bg-[#D9BC7E]/15 border border-[#A97F3E]/20 dark:border-[#D9BC7E]/30 hover:bg-[#A97F3E]/15 transition-colors mt-1 group"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#A97F3E] dark:text-[#D9BC7E]" />
                    <span className="text-xs font-bold text-[#8A6530] dark:text-[#D9BC7E]">{t('nav_admin') || 'Admin Panel'}</span>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-[#A97F3E] dark:text-[#D9BC7E]" />
                </Link>
              )}
            </div>

            {/* Preferences & Utilities */}
            <div className="p-2 border-t border-[#E8E0D2] dark:border-[var(--border-subtle)] bg-[#FAF7F2] dark:bg-[#161412]/40 space-y-2">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white dark:hover:bg-[#12110F] text-xs font-semibold text-[#1A1814] dark:text-[#F7F3EA] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-[#D9BC7E]" /> : <Sun className="w-4 h-4 text-[#A97F3E]" />}
                  <span>{t('profile_theme_dark') || 'Dark Mode'}</span>
                </div>
                <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${theme === 'dark' ? 'bg-[#D9BC7E]' : 'bg-slate-300'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </button>

              <div className="grid grid-cols-2 gap-1.5">
                <div className="relative">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                    className="w-full appearance-none bg-white dark:bg-[var(--surface)] border border-[#E8E0D2] dark:border-[var(--border-subtle)] rounded-lg py-1.5 pl-2.5 pr-6 text-xs font-bold text-[#1A1814] dark:text-[#F7F3EA] focus:outline-none focus:border-[#A97F3E] cursor-pointer"
                  >
                    {availableCurrencies.map(c => <option key={c.code} value={c.code}>{c.code} — {c.symbol}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#857D70] pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full appearance-none bg-white dark:bg-[var(--surface)] border border-[#E8E0D2] dark:border-[var(--border-subtle)] rounded-lg py-1.5 pl-2.5 pr-6 text-xs font-bold text-[#1A1814] dark:text-[#F7F3EA] focus:outline-none focus:border-[#A97F3E] cursor-pointer"
                  >
                    {availableLanguages.map(l => <option key={l.code} value={l.code}>{l.label} {l.flag}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#857D70] pointer-events-none" />
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-bold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('nav_signout') || 'Sign Out'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
