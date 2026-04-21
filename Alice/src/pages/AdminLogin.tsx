import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, LogIn, Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useLanguage } from '../context/LanguageContext';

interface AdminLoginProps {
  onClose?: () => void;
}

export default function AdminLogin({ onClose }: AdminLoginProps) {
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    
    const success = adminLogin(password);
    if (success) {
      onClose?.();
      navigate('/admin');
    } else {
      setError(language === 'fr' ? 'Mot de passe administrateur incorrect' : 'Incorrect admin password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.03)_0%,_transparent_70%)]" pointer-events="none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        <div className="glass-card rounded-2xl p-8 glow-gold">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8960c] flex items-center justify-center">
              <Shield className="text-white" size={28} />
            </div>
            <h1 className="font-heading text-2xl font-bold text-white">{language === 'fr' ? 'Administration' : 'Admin Panel'}</h1>
            <p className="text-gray-500 text-sm mt-2">
              {language === 'fr' ? 'Accès réservé au propriétaire' : 'Owner access only'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {language === 'fr' ? 'Mot de passe admin' : 'Admin Password'}
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#d4af37] outline-none transition-all placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  {language === 'fr' ? 'Accéder' : 'Access'}
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-xs">
            {language === 'fr' ? '⚠️ Toute tentative non autorisée sera enregistrée.' : '⚠️ All unauthorized attempts will be logged.'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}