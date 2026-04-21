import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export default function Reviews() {
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
            {t('reviews_title')}
          </h1>
          <p className="text-gray-400 text-lg">{t('reviews_subtitle')}</p>
        </motion.div>

        {data.reviews.length === 0 ? (
          <div className="text-center py-20">
            <Quote size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500">{t('reviews_no_reviews')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-8 relative"
              >
                {/* Quote icon */}
                <Quote className="absolute top-6 right-6 text-[#d4af37]/10" size={32} />
                
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < review.rating ? 'text-[#d4af37] fill-[#d4af37]' : 'text-gray-700'}
                    />
                  ))}
                </div>
                
                {/* Review text */}
                <p className="text-gray-300 leading-relaxed mb-6">
                  "{language === 'fr' ? review.text : review.textEn}"
                </p>
                
                {/* Author */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <p className="text-white font-medium">{review.author}</p>
                    <p className="text-gray-500 text-sm">{new Date(review.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long' })}</p>
                  </div>
                  {review.verified && (
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full flex items-center gap-1">
                      <Star size={10} className="fill-green-400" />
                      {language === 'fr' ? 'Vérifié' : 'Verified'}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Overall rating */}
        {data.reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 glass-card rounded-2xl p-8 text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="font-heading text-5xl font-bold gold-gradient">
                {(data.reviews.reduce((acc, r) => acc + r.rating, 0) / data.reviews.length).toFixed(1)}
              </span>
              <div className="text-left">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.round(data.reviews.reduce((acc, r) => acc + r.rating, 0) / data.reviews.length) ? 'text-[#d4af37] fill-[#d4af37]' : 'text-gray-700'}
                    />
                  ))}
                </div>
                <p className="text-gray-500 text-sm">{data.reviews.length} {language === 'fr' ? 'avis' : 'reviews'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}