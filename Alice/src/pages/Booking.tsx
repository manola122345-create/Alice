import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, CreditCard, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Booking as BookingType, generateId } from '../lib/data';
import { Link } from 'react-router-dom';

export default function Booking() {
  const { t, language } = useLanguage();
  const { data, addBooking } = useData();
  const { client, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: searchParams.get('duration') || '3hours',
    service: '',
    locationType: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (client) {
      setFormData(prev => ({ ...prev, name: client.name, email: client.email, phone: client.phone }));
    }
  }, [client]);

  const getPriceForDuration = (duration: string): number => {
    switch (duration) {
      case 'hour': return data.pricing.hour;
      case '2hours': return data.pricing.twoHours;
      case '3hours': return data.pricing.threeHours;
      case 'night': return data.pricing.night;
      case 'day': return data.pricing.day;
      case 'weekend': return data.pricing.weekend;
      case 'travel': return data.pricing.travel;
      default: return data.pricing.threeHours;
    }
  };

  const totalAmount = getPriceForDuration(formData.duration);
  const depositAmount = Math.round(totalAmount * 0.6);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.date) newErrors.date = t('common_required');
    if (!formData.time) newErrors.time = t('common_required');
    if (!formData.service) newErrors.service = t('common_required');
    if (!formData.locationType) newErrors.locationType = t('common_required');
    if (!formData.name) newErrors.name = t('common_required');
    if (!formData.email) newErrors.email = t('common_required');
    if (!formData.phone) newErrors.phone = t('common_required');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    if (!isAuthenticated) {
      alert(language === 'fr' ? 'Veuillez vous connecter pour réserver' : 'Please login to book');
      return;
    }

    const newId = generateId();
    const booking: BookingType = {
      id: newId,
      clientId: client!.id,
      clientName: formData.name,
      clientEmail: formData.email,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      service: formData.service,
      locationType: formData.locationType,
      message: formData.message,
      status: 'pending',
      depositPaid: false,
      totalAmount,
      depositAmount,
      paymentMethod: '',
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
    };

    await addBooking(booking);
    navigate(`/payment/${newId}`);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { delete prev[field]; return prev; });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: data.pricing.currency,
      minimumFractionDigits: 0,
    }).format(price);
  };



  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            {t('booking_title')}
          </h1>
          <p className="text-gray-400 text-lg">{t('booking_subtitle')}</p>
        </motion.div>

        {!isAuthenticated && (
          <div className="mb-8 glass-card rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-yellow-400">
              <AlertCircle size={20} />
              <span className="text-sm">
                {language === 'fr' ? 'Connectez-vous pour effectuer une réservation' : 'Please login to make a booking'}
              </span>
            </div>
            <div className="flex gap-2">
              <Link to={`/login?redirect=/booking`} className="px-4 py-2 text-sm border border-white/10 rounded-lg text-gray-300 hover:text-white transition-colors">
                {t('nav_login')}
              </Link>
              <Link to={`/register?redirect=/booking`} className="px-4 py-2 text-sm btn-gold">
                {t('nav_register')}
              </Link>
            </div>
 </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Date & Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="font-heading text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <Calendar className="text-[#d4af37]" size={20} />
              {language === 'fr' ? 'Date & Heure' : 'Date & Time'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('booking_date')}</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all"
                />
                {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('booking_time')}</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all"
                />
                {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
              </div>
            </div>
          </motion.div>

          {/* Service & Duration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="font-heading text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <Clock className="text-[#d4af37]" size={20} />
              {language === 'fr' ? 'Service & Durée' : 'Service & Duration'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('booking_duration')}</label>
                <select
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#d4af37] outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="hour" className="bg-[#1a1a25]">{t('pricing_hour')} - {formatPrice(data.pricing.hour)}</option>
                  <option value="2hours" className="bg-[#1a1a25]">{t('pricing_2hours')} - {formatPrice(data.pricing.twoHours)}</option>
                  <option value="3hours" className="bg-[#1a1a25]">{t('pricing_3hours')} - {formatPrice(data.pricing.threeHours)}</option>
                  <option value="night" className="bg-[#1a1a25]">{t('pricing_night')} - {formatPrice(data.pricing.night)}</option>
                  <option value="day" className="bg-[#1a1a25]">{t('pricing_day')} - {formatPrice(data.pricing.day)}</option>
                  <option value="weekend" className="bg-[#1a1a25]">{t('pricing_weekend')} - {formatPrice(data.pricing.weekend)}</option>
                  <option value="travel" className="bg-[#1a1a25]">{t('pricing_travel')} - {formatPrice(data.pricing.travel)}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('booking_service')}</label>
                <select
                  value={formData.service}
                  onChange={(e) => handleChange('service', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#d4af37] outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#1a1a25]">{language === 'fr' ? 'Sélectionner...' : 'Select...'}</option>
                  {data.services.map(s => (
                    <option key={s.id} value={language === 'fr' ? s.name : s.nameEn} className="bg-[#1a1a25]">
                      {language === 'fr' ? s.name : s.nameEn}
                    </option>
                  ))}
                </select>
                {errors.service && <p className="text-red-400 text-xs mt-1">{errors.service}</p>}
              </div>
            </div>
          </motion.div>

          {/* Location Type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="font-heading text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <MapPin className="text-[#d4af37]" size={20} />
              {t('booking_location_type')}
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { value: 'my_place', label: t('location_my_place'), icon: '🏠' },
                { value: 'your_place', label: t('location_your_place'), icon: '🏨' },
                { value: 'hotel', label: t('location_hotel'), icon: '🏢' },
              ].map((loc) => (
                <label
                  key={loc.value}
                  className={`relative flex flex-col items-center p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.locationType === loc.value
                      ? 'border-[#d4af37] bg-[#d4af37]/10'
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <input
                    type="radio"
                    name="locationType"
                    value={loc.value}
                    checked={formData.locationType === loc.value}
                    onChange={(e) => handleChange('locationType', e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-3xl mb-3">{loc.icon}</span>
                  <span className="text-sm font-medium text-white text-center">{loc.label}</span>
                  {formData.locationType === loc.value && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#d4af37] flex items-center justify-center">
                      <CheckCircle size={12} className="text-[#0a0a0f]" />
                    </div>
                  )}
                </label>
              ))}
            </div>
            {errors.locationType && <p className="text-red-400 text-xs mt-2">{errors.locationType}</p>}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="font-heading text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <Send className="text-[#d4af37]" size={20} />
              {language === 'fr' ? 'Vos coordonnées' : 'Your Details'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('booking_name')}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#d4af37] outline-none transition-all"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('booking_email')}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#d4af37] outline-none transition-all"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('booking_phone')}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#d4af37] outline-none transition-all"
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('booking_message')}</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#d4af37] outline-none transition-all resize-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Price Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-8 border-[#d4af37]/20"
          >
            <h2 className="font-heading text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <CreditCard className="text-[#d4af37]" size={20} />
              {language === 'fr' ? 'Récapitulatif tarifaire' : 'Price Summary'}
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>{language === 'fr' ? 'Total' : 'Total'}</span>
                <span className="text-white font-medium">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>{language === 'fr' ? 'Acompte (60%)' : 'Deposit (60%)'}</span>
                <span className="text-[#d4af37] font-semibold text-lg">{formatPrice(depositAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-xs pt-3 border-t border-white/10">
                <span>{language === 'fr' ? 'Solde à régler sur place' : 'Balance due on site'}</span>
                <span>{formatPrice(totalAmount - depositAmount)}</span>
              </div>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <button
              type="submit"
              disabled={!isAuthenticated}
              className={`w-full btn-gold text-lg py-5 rounded-xl flex items-center justify-center gap-3 ${
                !isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Send size={20} />
              {t('booking_submit')}
            </button>
            {!isAuthenticated && (
              <p className="text-center text-yellow-400 text-sm mt-3">
                {language === 'fr' ? '⚠️ Veuillez vous connecter pour réserver' : '⚠️ Please login to book'}
              </p>
            )}
          </motion.div>
        </form>
      </div>
    </div>
  );
}