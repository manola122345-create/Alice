import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, Clock, Phone, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';

export default function Home() {
  const { t, language } = useLanguage();
  const { data } = useData();
  const bio = language === 'fr' ? data.profile.bio : data.profile.bioEn;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,175,55,0.08)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,175,55,0.05)_0%,_transparent_50%)]" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#d4af37]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#d4af37]/3 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Text content */}
            <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 mb-6">
                <Star size={14} className="text-[#d4af37] fill-[#d4af37]" />
                <span className="text-[#d4af37] text-sm font-medium">{language === 'fr' ? 'Escorte Premium' : 'Premium Companion'}</span>
              </div>
              
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
                {t('hero_title')}
                <span className="block gold-gradient mt-2">{data.profile.name}</span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-8 max-w-lg leading-relaxed">
                {t('hero_subtitle')}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/booking" className="btn-gold inline-flex items-center gap-2 text-base px-8 py-4">
                  {t('hero_cta')}
                  <ArrowRight size={18} />
                </Link>
                <Link to="/services" className="btn-outline-gold inline-flex items-center gap-2 text-base px-8 py-4">
                  {t('hero_secondary')}
                </Link>
              </div>
              
              {/* Quick info */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2"><MapPin size={14} />{data.profile.location}</span>
                <span className="flex items-center gap-2"><Clock size={14} />{language === 'fr' ? 'Disponible' : 'Available'}</span>
                <span className="flex items-center gap-2"><Phone size={14} />{data.contacts.phone}</span>
              </div>
            </motion.div>
            
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative block order-first lg:order-last"
            >
              <div className="relative aspect-[3/4] max-w-xs mx-auto lg:max-w-md">
                {/* Frame */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#d4af37]/20 to-transparent rotate-3 scale-[0.98]" />
                <div className="absolute inset-0 rounded-3xl border border-[#d4af37]/20 -rotate-2 scale-[0.99]" />
                
                {/* Image container */}
                <div className="relative w-full h-full rounded-3xl overflow-hidden glow-gold">
                  {data.profile.heroImage ? (
                    <img 
                      src={data.profile.heroImage} 
                      alt={data.profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a1a25] to-[#12121a] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 flex items-center justify-center mb-4">
                          <span className="font-heading text-6xl gold-gradient">A</span>
                        </div>
                        <p className="text-gray-500 text-sm">{data.profile.name}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 via-transparent to-transparent" />
                </div>
                
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 glass-card rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{language === 'fr' ? 'Disponible' : 'Available'}</p>
                    <p className="text-gray-500 text-xs">{language === 'fr' ? 'Pour rendez-vous' : 'For booking'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-3xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
                  {t('about_title')}
                </h2>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {bio.slice(0, 400)}...
                </p>
                <Link to="/about" className="inline-flex items-center gap-2 mt-6 text-[#d4af37] hover:text-[#f4e4bc] transition-colors font-medium">
                  {language === 'fr' ? 'En savoir plus' : 'Learn more'}
                  <ChevronRight size={16} />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: t('about_age'), value: `${data.profile.age} ${language === 'fr' ? 'ans' : 'yo'}` },
                  { label: t('about_height'), value: data.profile.height },
                  { label: t('about_location'), value: data.profile.location },
                  { label: t('about_languages'), value: data.profile.languages.join(', ') },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className="text-white font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              {t('services_title')}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t('services_subtitle')}</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.services.slice(0, 6).map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 hover:border-[#d4af37]/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/20 transition-colors">
                  <span className="text-2xl">
                    {service.icon === 'utensils' && '🍽️'}
                    {service.icon === 'sparkles' && '✨'}
                    {service.icon === 'heart' && '💕'}
                    {service.icon === 'plane' && '✈️'}
                    {service.icon === 'moon' && '🌙'}
                    {service.icon === 'hands' && '💆'}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-white mb-2">
                  {language === 'fr' ? service.name : service.nameEn}
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                  {language === 'fr' ? service.description : service.descriptionEn}
                </p>
                {service.duration && (
                  <span className="text-[#d4af37] text-xs font-medium">{service.duration}</span>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/services" className="btn-outline-gold inline-flex items-center gap-2">
              {language === 'fr' ? 'Voir tous les services' : 'View all services'}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/10 via-transparent to-[#d4af37]/5" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6">
              {language === 'fr' ? 'Prêt à vivre une expérience unique ?' : 'Ready for a unique experience?'}
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              {language === 'fr'
                ? 'Réservez dès maintenant votre moment privilégié avec moi. Chaque rencontre est un voyage inoubliable.'
                : 'Book your privileged moment with me now. Every encounter is an unforgettable journey.'}
            </p>
            <Link to="/booking" className="btn-gold inline-flex items-center gap-2 text-lg px-10 py-5">
              {t('hero_cta')}
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
