import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export default function Footer() {
  const { t, language } = useLanguage();
  const { data } = useData();
  const currentYear = new Date().getFullYear();
  
  // Long press state for secret admin access
  const [isPressing, setIsPressing] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);
  let pressTimer: ReturnType<typeof setTimeout> | null = null;
  let progressTimer: ReturnType<typeof setInterval> | null = null;

  const handlePressStart = () => {
    setIsPressing(true);
    setPressProgress(0);
    
    // Progress animation
    progressTimer = setInterval(() => {
      setPressProgress(prev => {
        if (prev >= 100) return prev;
        return prev + 3.33; // ~3 seconds to fill
      });
    }, 100);

    // Trigger after 3 seconds
    pressTimer = setTimeout(() => {
      if (progressTimer) clearInterval(progressTimer);
      setPressProgress(100);
      setIsPressing(false);
      
      // Dispatch custom event for App.tsx to catch
      window.dispatchEvent(new CustomEvent('admin:open-login'));
    }, 3000);
  };

  const handlePressEnd = () => {
    setIsPressing(false);
    setPressProgress(0);
    if (pressTimer) clearTimeout(pressTimer);
    if (progressTimer) clearInterval(progressTimer);
  };

  // Listen for admin open event from App.tsx
  const [showAdminHint, setShowAdminHint] = useState(false);

  return (
    <footer className="bg-[#08080c] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            {/* Logo avec long-press secret pour admin */}
            <Link 
              to="/" 
              className="flex items-center gap-2 mb-4 group"
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
            >
              <div 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4e4bc] flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-105"
                style={{ cursor: 'default' }}
              >
                <span className="text-[#0a0a0f] font-heading font-bold text-lg relative z-10">A</span>
                
                {/* Progress ring on long press */}
                {isPressing && (
                  <div 
                    className="absolute inset-0 bg-[#d4af37]/30 rounded-full"
                    style={{ 
                      clipPath: `inset(${100 - pressProgress}% 0 0 0)`,
                      transition: 'none'
                    }}
                  />
                )}
              </div>
              <span className="font-heading text-xl font-semibold gold-gradient group-hover:opacity-80 transition-opacity">
                Alice Elite
              </span>
            </Link>
            
            {/* Subtle hint that appears on hover near logo */}
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {language === 'fr'
                ? 'Compagne elegante et raffinee pour des moments d exception.'
                : 'Elegant and refined companion for exceptional moments.'}
            </p>
            
            <div className="flex items-center gap-3">
              <a href={data.contacts.telegramUrl} target="_blank" rel="noopener noreferrer" 
                 className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#d4af37] hover:border-[#d4af37]/30 transition-all">
                <Send size={16} />
              </a>
              <a href={`mailto:${data.contacts.email}`} 
                 className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#d4af37] hover:border-[#d4af37]/30 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#d4af37] hover:border-[#d4af37]/30 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-white font-semibold mb-4">{language === 'fr' ? 'Navigation' : 'Navigation'}</h4>
            <ul className="space-y-3">
              {[['/', t('nav_home')], ['/about', t('nav_about')], ['/services', t('nav_services')], ['/gallery', t('nav_gallery')], ['/pricing', t('nav_pricing')]].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-gray-500 hover:text-[#d4af37] text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-white font-semibold mb-4">{t('nav_services')}</h4>
            <ul className="space-y-3">
              {data.services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <span className="text-gray-500 text-sm">{language === 'fr' ? service.name : service.nameEn}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading text-white font-semibold mb-4">{language === 'fr' ? 'Legal' : 'Legal'}</h4>
            <ul className="space-y-3">
              <li><Link to="/terms" className="text-gray-500 hover:text-[#d4af37] text-sm transition-colors">{t('footer_terms')}</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-[#d4af37] text-sm transition-colors">{t('footer_privacy')}</Link></li>
              <li><span className="text-gray-500 text-sm cursor-pointer hover:text-[#d4af37] transition-colors">{t('footer_legal')}</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm flex items-center gap-1">
            &copy; {currentYear} Alice Elite. {t('footer_rights')}.
            <Heart size={12} className="text-red-400 fill-red-400" />
          </p>
          <p className="text-gray-700 text-xs">
            {language === 'fr'
              ? 'Ce site est reserve aux adultes de 18 ans et plus.'
              : 'This site is intended for adults 18 years and older.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
