import { useState } from 'react';
import { Shield, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AgeVerificationProps {
  onVerified: () => void;
  onDeclined: () => void;
}

export default function AgeVerification({ onVerified, onDeclined }: AgeVerificationProps) {
  const { t } = useLanguage();
  const [isExiting, setIsExiting] = useState(false);

  const handleConfirm = () => {
    setIsExiting(true);
    setTimeout(() => onVerified(), 300);
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      <div className="glass-card rounded-2xl p-8 md:p-12 max-w-md mx-4 text-center glow-gold">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 flex items-center justify-center">
          <Shield className="text-[#d4af37]" size={40} />
        </div>
        
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
          {t('age_title')}
        </h2>
        
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          {t('age_message')}
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            className="w-full btn-gold text-base py-4 rounded-xl"
          >
            {t('age_confirm')}
          </button>
          <button
            onClick={handleDecline}
            className="w-full px-6 py-4 text-gray-500 hover:text-gray-300 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-sm"
          >
            {t('age_decline')}
          </button>
        </div>
        
        <p className="mt-6 text-gray-600 text-xs">
          18+ | Adult Content | {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}