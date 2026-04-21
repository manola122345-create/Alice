import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, MapPin, Phone, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export default function Contact() {
  const { t, language } = useLanguage();
  const { data } = useData();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            {t('contact_title')}
          </h1>
          <p className="text-gray-400 text-lg">{t('contact_subtitle')}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {sent ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Send className="text-green-500" size={28} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-2">
                  {language === 'fr' ? 'Message envoyé !' : 'Message Sent!'}
                </h3>
                <p className="text-gray-400">
                  {language === 'fr' ? 'Je vous répondrai dans les plus brefs délais.' : 'I will get back to you as soon as possible.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t('contact_name')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#d4af37] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t('contact_email')}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#d4af37] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t('contact_subject')}</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#d4af37] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t('contact_message')}</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                    rows={5}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#d4af37] outline-none transition-all resize-none"
                  />
                </div>
                <button type="submit" className="w-full btn-gold py-4 flex items-center justify-center gap-2">
                  <Send size={18} />
                  {t('contact_send')}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Telegram */}
            <div className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-[#d4af37]/30 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-[#0088cc]/10 flex items-center justify-center shrink-0">
                <MessageSquare className="text-[#0088cc]" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Telegram</h3>
                <p className="text-gray-400 text-sm">{data.contacts.telegram}</p>
              </div>
              <a
                href={data.contacts.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#0088cc]/10 text-[#0088cc] rounded-lg text-sm font-medium hover:bg-[#0088cc]/20 transition-colors flex items-center gap-1"
              >
                {language === 'fr' ? 'Contacter' : 'Contact'}
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Email */}
            <div className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-[#d4af37]/30 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-[#d4af37]/10 flex items-center justify-center shrink-0">
                <Mail className="text-[#d4af37]" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Email</h3>
                <p className="text-gray-400 text-sm">{data.contacts.email}</p>
              </div>
              <a
                href={`mailto:${data.contacts.email}`}
                className="px-4 py-2 bg-[#d4af37]/10 text-[#d4af37] rounded-lg text-sm font-medium hover:bg-[#d4af37]/20 transition-colors"
              >
                {t('contact_send')}
              </a>
            </div>

            {/* Phone */}
            <div className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-[#d4af37]/30 transition-all">
              <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                <Phone className="text-green-500" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{language === 'fr' ? 'Téléphone' : 'Phone'}</h3>
                <p className="text-gray-400 text-sm">{data.contacts.phone}</p>
              </div>
            </div>

            {/* Location */}
            <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                <MapPin className="text-purple-500" size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold">{t('about_location')}</h3>
                <p className="text-gray-400 text-sm">{data.profile.location}</p>
              </div>
            </div>

            {/* Availability note */}
            <div className="glass-card rounded-2xl p-6 border-[#d4af37]/10">
              <p className="text-gray-400 text-sm leading-relaxed">
                <span className="text-[#d4af37] font-semibold">{language === 'fr' ? 'Note :' : 'Note:'}</span>{' '}
                {language === 'fr'
                  ? 'Pour une réponse plus rapide, je vous recommande de me contacter via Telegram. Je m\'efforce de répondre dans les 24 heures.'
                  : 'For a faster response, I recommend contacting me via Telegram. I strive to respond within 24 hours.'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}