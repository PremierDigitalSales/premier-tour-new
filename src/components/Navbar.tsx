import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import {
  Compass, Hotel, Car, Plane, BookOpen, Phone, Info,
  ShieldCheck, Menu, X, Home, LogOut, Sparkles, Sun, Moon
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { ProfileDropdown } from './ProfileDropdown';
import { SafeImage } from './ui/SafeImage';
import { Logo } from './Logo';

const HERO_ROUTES = ['/', '/tours', '/hotels', '/flights', '/cars', '/about', '/blog', '/contact', '/reviews'];

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t, language, setLanguage, availableLanguages } = useLanguage();
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { label: t('nav_home') || 'Home', path: '/' },
    { label: t('nav_tours') || 'Tours', path: '/tours' },
    { label: t('nav_hotels') || 'Hotels', path: '/hotels' },
    { label: t('nav_flights') || 'Flights', path: '/flights' },
    { label: t('nav_cars') || 'Rent a Car', path: '/cars' },
    { label: t('nav_about') || 'About Us', path: '/about' },
    { label: t('nav_blog') || 'Blog', path: '/blog' },
    { label: t('nav_contact') || 'Contact Us', path: '/contact' },
  ];

  const overHero = !scrolled && !mobileMenuOpen && HERO_ROUTES.includes(location.pathname);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        overHero
          ? 'bg-gradient-to-b from-black/55 to-transparent border-b border-white/10 py-5'
          : 'premier-nav py-3'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between">
        {/* Brand */}
        <Logo to="/" variant={overHero ? 'light' : 'default'} />

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-3 text-[11px] xl:text-[12px] font-medium uppercase tracking-[0.18em]">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative px-2.5 xl:px-3 py-2 transition-colors duration-300 whitespace-nowrap ${
                  active
                    ? overHero ? 'text-[#F1DDA9]' : 'text-[var(--primary)]'
                    : overHero
                      ? 'text-white/85 hover:text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--primary)]'
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-px bg-current transition-all duration-300 ${
                    active ? 'w-5' : 'w-0 group-hover:w-5'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Utilities & User Profile */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
              overHero
                ? 'border-white/30 text-white hover:border-[#E6CF9B] hover:text-[#E6CF9B]'
                : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {user ? (
            <ProfileDropdown />
          ) : (
            <Link
              to="/auth"
              className="emerald-btn px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('nav_signin')}</span>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-2 rounded-full border ${
              overHero ? 'border-white/30 text-white' : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {user ? (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-9 h-9 rounded-full border border-[#A97F3E]/30 overflow-hidden bg-[#F4EFE6] dark:bg-[var(--surface)] flex items-center justify-center"
            >
              {user.avatar_url ? (
                <SafeImage src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-[#A97F3E] dark:text-[#D9BC7E]">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </Link>
          ) : (
            <Link to="/auth" className={`text-sm font-semibold px-2 py-1 ${overHero ? 'text-[#E6CF9B]' : 'text-[var(--primary)]'}`}>
              {t('nav_signin') || 'Sign In'}
            </Link>
          )}
          <button
            type="button"
            className={`p-2 rounded-full border ${
              overHero
                ? 'bg-white/10 text-white border-white/30 backdrop-blur-md'
                : 'bg-[#F4EFE6] dark:bg-[var(--surface)] text-[#1A1814] dark:text-[#F7F3EA] border-[#E8E0D2] dark:border-[var(--border-subtle)]'
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden absolute top-full left-0 right-0 mx-3 mt-2 bg-white dark:bg-[var(--surface)] border border-[#E8E0D2] dark:border-[var(--border-subtle)] rounded-2xl shadow-xl p-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto"
          >
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-[#A97F3E] text-white font-bold'
                      : 'text-[#1A1814] dark:text-[#F7F3EA] hover:bg-[#F4EFE6] dark:hover:bg-[#1A1815]'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <hr className="border-[#E8E0D2] dark:border-[var(--border-subtle)] my-2" />

            <div className="grid grid-cols-2 gap-2 my-1">
              <div>
                <label className="block text-[11px] font-bold text-[#857D70] mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full bg-[#F4EFE6] dark:bg-[#14130F] border border-[#E8E0D2] dark:border-[var(--border-subtle)] rounded-xl py-2 px-3 text-xs font-bold text-[#1A1814] dark:text-[#F7F3EA]"
                >
                  {availableLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#857D70] mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="w-full bg-[#F4EFE6] dark:bg-[#14130F] border border-[#E8E0D2] dark:border-[var(--border-subtle)] rounded-xl py-2 px-3 text-xs font-bold text-[#1A1814] dark:text-[#F7F3EA]"
                >
                  {availableCurrencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="border-[#E8E0D2] dark:border-[var(--border-subtle)] my-2" />
            
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl text-sm font-bold bg-[#A97F3E]/10 text-[#8A6530] dark:text-[#D9BC7E] border border-[#A97F3E]/20 mb-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#A97F3E]" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <div className="flex items-center justify-between px-2 py-2">
                  <div className="text-left">
                    <p className="text-sm font-bold text-[#1A1814] dark:text-[#F7F3EA]">{user.full_name}</p>
                    <p className="text-xs text-[#857D70] dark:text-[#A39A8B]">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="emerald-btn w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
