import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, User, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { client, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('nav_home') },
    { to: '/about', label: t('nav_about') },
    { to: '/services', label: t('nav_services') },
    { to: '/gallery', label: t('nav_gallery') },
    { to: '/pricing', label: t('nav_pricing') },
    { to: '/reviews', label: t('nav_reviews') },
    { to: '/booking', label: t('nav_booking') },
    { to: '/contact', label: t('nav_contact') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4e4bc] flex items-center justify-center">
              <span className="text-[#0a0a0f] font-heading font-bold text-lg">A</span>
            </div>
            <span className="font-heading text-xl font-semibold gold-gradient group-hover:opacity-80 transition-opacity">
              Alice Elite
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  location.pathname === link.to
                    ? 'text-[#d4af37] bg-[#d4af37]/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-[#d4af37] border border-white/10 rounded-lg hover:border-[#d4af37]/30 transition-all"
            >
              <Globe size={14} />
              {language === 'fr' ? 'EN' : 'FR'}
            </button>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white border border-white/10 rounded-lg hover:border-white/30 transition-all"
                >
                  <User size={14} />
                  {client?.name?.split(' ')[0] || t('nav_dashboard')}
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                  title={t('nav_logout')}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border border-white/10 rounded-lg hover:border-white/30 transition-all"
                >
                  {t('nav_login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium btn-gold text-xs"
                >
                  {t('nav_register')}
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  location.pathname === link.to
                    ? 'text-[#d4af37] bg-[#d4af37]/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 space-y-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-center text-gray-300 border border-white/10 rounded-lg"
                  >
                    {t('nav_login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-center btn-gold"
                  >
                    {t('nav_register')}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-center text-gray-300 border border-white/10 rounded-lg"
                  >
                    {t('nav_dashboard')}
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full px-4 py-3 text-center text-red-400 border border-red-400/20 rounded-lg"
                  >
                    {t('nav_logout')}
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
