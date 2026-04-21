import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { MapPin, Ruler, Weight, Eye, Scissors, Shirt, Globe, Languages, User } from 'lucide-react';

export default function About() {
  const { t, language } = useLanguage();
  const { data } = useData();
  const bio = language === 'fr' ? data.profile.bio : data.profile.bioEn;

  const stats = [
    { icon: User, label: t('about_age'), value: `${data.profile.age} ${language === 'fr' ? 'ans' : 'years old'}` },
    { icon: Ruler, label: t('about_height'), value: data.profile.height },
    { icon: Weight, label: t('about_weight'), value: data.profile.weight },
    { icon: Eye, label: t('about_eyes'), value: data.profile.eyes },
    { icon: Scissors, label: t('about_hair'), value: data.profile.hair },
    { icon: Shirt, label: t('about_bust'), value: data.profile.bust },
    { icon: Globe, label: t('about_ethnicity'), value: data.profile.ethnicity },
    { icon: MapPin, label: t('about_location'), value: data.profile.location },
    { icon: Languages, label: t('about_languages'), value: data.profile.languages.join(', ') },
  ];

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
            {t('about_title')}
          </h1>
          <p className="text-gray-400 text-lg">{t('about_subtitle')}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Main image */}
            <div className="rounded-2xl overflow-hidden glow-gold aspect-[3/4]">
              {data.profile.heroImage ? (
                <img src={data.profile.heroImage} alt={data.profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1a1a25] to-[#12121a] flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 flex items-center justify-center">
                    <span className="font-heading text-7xl gold-gradient">A</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Secondary images */}
            {data.profile.profileImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {data.profile.profileImages.slice(0, 2).map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden aspect-square">
                    <img src={typeof img === 'string' ? img : img.url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Bio & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {/* Bio card */}
            <div className="glass-card rounded-2xl p-8">
              <h2 className="font-heading text-2xl font-bold text-white mb-4 gold-gradient">
                {data.profile.alias || data.profile.name}
              </h2>
              <div className="text-gray-400 leading-relaxed whitespace-pre-line">
                {bio}
              </div>
            </div>

            {/* Stats grid */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="font-heading text-xl font-semibold text-white mb-6">
                {language === 'fr' ? 'Caractéristiques' : 'Characteristics'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <stat.icon size={14} className="text-[#d4af37]" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider">{stat.label}</p>
                      <p className="text-white font-medium text-sm">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
