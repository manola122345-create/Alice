import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

export default function Terms() {
  const { t, language } = useLanguage();
  const { data } = useData();
  const termsContent = language === 'fr' ? data.terms.fr : data.terms.en;

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('## ')) {
        return <h2 key={index} className="font-heading text-2xl font-bold text-white mt-8 mb-4">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold text-[#d4af37] mt-6 mb-3">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="text-gray-400 ml-5 mb-1 list-disc">{line.replace('- ', '')}</li>;
      }
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }
      return <p key={index} className="text-gray-400 leading-relaxed mb-2">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            {t('title_terms')}
          </h1>
          <p className="text-gray-400 text-lg">{t('terms_subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-8 md:p-12"
        >
          {renderContent(termsContent)}
        </motion.div>
      </div>
    </div>
  );
}