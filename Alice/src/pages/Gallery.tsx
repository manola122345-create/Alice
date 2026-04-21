import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export default function Gallery() {
  const { t, language } = useLanguage();
  const { data } = useData();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const allImages: { url: string; alt: string }[] = [
    ...(data.profile.heroImage ? [{ url: data.profile.heroImage, alt: data.profile.name }] : []),
    ...data.profile.profileImages.map(img => ({ url: typeof img === 'string' ? img : img.url, alt: typeof img === 'string' ? '' : (img.alt || '') })),
    ...data.gallery.map(img => ({ url: img.url, alt: language === 'fr' ? img.alt : img.altEn })),
  ];

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    if (direction === 'next') {
      setSelectedImage((selectedImage + 1) % allImages.length);
    } else {
      setSelectedImage((selectedImage - 1 + allImages.length) % allImages.length);
    }
  };

  // Placeholder images when no real images uploaded
  const displayImages = allImages.length > 0 ? allImages : Array.from({ length: 6 }, (_, i) => ({
    url: '',
    alt: `Photo ${i + 1}`,
    placeholder: true as const
  }));

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
            {t('gallery_title')}
          </h1>
          <p className="text-gray-400 text-lg">{t('gallery_subtitle')}</p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => !('placeholder' in image) && setSelectedImage(index)}
              className={`aspect-square rounded-xl overflow-hidden cursor-pointer group relative ${
                'placeholder' in image ? 'pointer-events-none' : ''
              }`}
            >
              {'placeholder' in image ? (
                <div className="w-full h-full bg-gradient-to-br from-[#1a1a25] to-[#12121a] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#d4af37]/10 flex items-center justify-center mb-2">
                      <span className="text-[#d4af37] text-xl">📷</span>
                    </div>
                    <p className="text-gray-600 text-xs">{image.alt}</p>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
              onClick={() => setSelectedImage(null)}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors z-10"
              >
                <X size={28} />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                className="absolute left-6 p-2 text-white/70 hover:text-white transition-colors z-10"
              >
                <ChevronLeft size={32} />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                className="absolute right-6 p-2 text-white/70 hover:text-white transition-colors z-10"
              >
                <ChevronRight size={32} />
              </button>
              
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={allImages[selectedImage]?.url}
                alt=""
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}