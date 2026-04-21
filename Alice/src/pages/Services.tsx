import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Services() {
  const { t, language } = useLanguage();
  const { data } = useData();

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
            {t('services_title')}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t('services_subtitle')}</p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group glass-card rounded-2xl p-8 hover:border-[#d4af37]/30 transition-all duration-500 relative overflow-hidden"
            >
              {/* Background glow on hover */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#d4af37]/5 rounded-full blur-2xl group-hover:bg-[#d4af37]/10 transition-all duration-500" />
              
              <div className="relative">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 flex items-center justify-center mb-6 group-hover:from-[#d4af37]/30 group-hover:to-[#d4af37]/10 transition-all">
                  <span className="text-3xl">
                    {service.icon === 'utensils' && '🍽️'}
                    {service.icon === 'sparkles' && '✨'}
                    {service.icon === 'heart' && '💕'}
                    {service.icon === 'plane' && '✈️'}
                    {service.icon === 'moon' && '🌙'}
                    {service.icon === 'hands' && '💆‍♀️'}
                  </span>
                </div>
                
                {/* Title & Description */}
                <h3 className="font-heading text-xl font-semibold text-white mb-3 group-hover:text-[#d4af37] transition-colors">
                  {language === 'fr' ? service.name : service.nameEn}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  {language === 'fr' ? service.description : service.descriptionEn}
                </p>
                
                {/* Duration */}
                {service.duration && (
                  <div className="flex items-center gap-2 text-[#d4af37] text-sm font-medium mb-6">
                    <Clock size={14} />
                    {service.duration}
                  </div>
                )}
                
                {/* CTA */}
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#d4af37] hover:text-[#f4e4bc] transition-colors group/link"
                >
                  {t('nav_booking')}
                  <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16 glass-card rounded-2xl p-12"
        >
          <h3 className="font-heading text-2xl font-bold text-white mb-4">
            {language === 'fr' ? 'Vous ne trouvez pas ce que vous cherchez ?' : "Can't find what you're looking for?"}
          </h3>
          <p className="text-gray-400 mb-6">
            {language === 'fr'
              ? 'Contactez-moi pour discuter de vos besoins spécifiques.'
              : 'Contact me to discuss your specific needs.'}
          </p>
          <Link to="/contact" className="btn-gold inline-flex items-center gap-2">
            {t('nav_contact')}
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}