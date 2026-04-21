import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const { t, language } = useLanguage();
  const { data } = useData();
  const { pricing } = data;
  
  const plans = [
    { id: 'hour', label: t('pricing_hour'), price: pricing.hour, popular: false },
    { id: '2hours', label: t('pricing_2hours'), price: pricing.twoHours, popular: false },
    { id: '3hours', label: t('pricing_3hours'), price: pricing.threeHours, popular: true },
    { id: 'night', label: t('pricing_night'), price: pricing.night, popular: false },
    { id: 'day', label: t('pricing_day'), price: pricing.day, popular: false },
    { id: 'weekend', label: t('pricing_weekend'), price: pricing.weekend, popular: false },
    { id: 'travel', label: t('pricing_travel'), price: pricing.travel, popular: false },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: pricing.currency,
      minimumFractionDigits: 0,
    }).format(price);
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
            {t('pricing_title')}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t('pricing_subtitle')}</p>
        </motion.div>

        {/* Deposit Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 glass-card rounded-2xl p-6 flex items-center gap-4 border-[#d4af37]/20"
        >
          <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center shrink-0">
            <CreditCard className="text-[#d4af37]" size={24} />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">{t('pricing_deposit')}</h3>
            <p className="text-gray-400 text-sm">{t('booking_deposit_info')}</p>
          </div>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`relative glass-card rounded-2xl p-8 transition-all duration-300 hover:border-[#d4af37]/30 ${
                plan.popular ? 'border-[#d4af37]/40 glow-gold' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#d4af37] to-[#b8960c] rounded-full text-[#0a0a0f] text-xs font-bold">
                  {language === 'fr' ? 'Populaire' : 'Popular'}
                </div>
              )}
              
              <h3 className="text-white font-semibold text-lg mb-4">{plan.label}</h3>
              <div className="mb-6">
                <span className="font-heading text-4xl font-bold gold-gradient">{formatPrice(plan.price)}</span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle size={14} className="text-green-500 shrink-0" />
                  {language === 'fr' ? 'Temps dédié exclusif' : 'Exclusive dedicated time'}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle size={14} className="text-green-500 shrink-0" />
                  {language === 'fr' ? 'Confidentialité garantie' : 'Guaranteed confidentiality'}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle size={14} className="text-green-500 shrink-0" />
                  {language === 'fr' ? 'Service premium' : 'Premium service'}
                </div>
              </div>
              
              <Link
                to={`/booking?duration=${plan.id}`}
                className={`block w-full text-center py-3 rounded-xl font-medium transition-all ${
                  plan.popular
                      ? 'btn-gold'
                      : 'border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10'
                  }`}
              >
                {t('nav_booking')}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Payment Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8"
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="text-[#d4af37] shrink-0 mt-1" size={20} />
            <div>
              <h3 className="text-white font-semibold mb-2">
                {language === 'fr' ? 'Informations de paiement' : 'Payment Information'}
              </h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• {language === 'fr' ? 'Acompte de 60% requis à la réservation' : '60% deposit required at booking'}</li>
                <li>• {language === 'fr' ? 'Solde payable au début du rendez-vous' : 'Balance payable at the start of the appointment'}</li>
                <li>• {language === 'fr' ? 'Paiement par virement ou crypto-monnaie' : 'Payment by bank transfer or cryptocurrency'}</li>
                <li>• {language === 'fr' ? 'Les instructions sont envoyées après validation' : 'Instructions sent after validation'}</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}