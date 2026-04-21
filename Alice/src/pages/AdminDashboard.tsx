import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, User, Tag, Image, Star, Mail, FileText, MessageSquare,
  Calendar, Settings, LogOut, Save, Plus, Trash2, Upload, ChevronLeft,
  Send, CheckCircle, Clock, XCircle, Edit3, Eye
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useData } from '../context/DataContext';
import { SiteData, Service, Review, GalleryImage, Message, Booking, generateId } from '../lib/data';

export default function AdminDashboard() {
  const { isAdmin, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { data, updateData, bookings, updateBooking, messages, addMessage, markMessageRead } = useData();
  
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [selectedClientChat, setSelectedClientChat] = useState<string | null>(null);
  const [adminReply, setAdminReply] = useState('');

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  // Get unique clients who have messaged
  const clientConversations = Array.from(
    new Set(messages.filter(m => m.senderId !== 'admin').map(m => m.senderId))
  ).map(clientId => {
    const lastMsg = messages.filter(m => m.senderId === clientId || (m.senderId === 'admin' && m.receiverId === clientId)).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    const clientName = messages.find(m => m.senderId === clientId)?.senderName || clientId;
    const unread = messages.filter(m => m.senderId === clientId && m.receiverId === 'admin' && !m.read).length;
    return { clientId, clientName, lastMsg, unread };
  });

  const currentConversation = selectedClientChat 
    ? messages.filter(m => 
        (m.senderId === selectedClientChat && m.receiverId === 'admin') ||
        (m.senderId === 'admin' && m.receiverId === selectedClientChat)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (field === 'heroImage') {
        updateData({ profile: { ...data.profile, heroImage: result } });
      } else if (field === 'profileImages' && index !== undefined) {
        const newImages = [...data.profile.profileImages];
        if (newImages[index]) {
          newImages[index] = { ...newImages[index], url: result };
        }
        updateData({ profile: { ...data.profile, profileImages: newImages } });
      } else if (field === 'gallery' && index !== undefined) {
        const newGallery = [...data.gallery];
        newGallery[index] = { ...newGallery[index], url: result };
        updateData({ gallery: newGallery });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddGalleryImage = () => {
    const newImg: GalleryImage = {
      id: generateId(),
      url: '',
      alt: `Photo ${data.gallery.length + 1}`,
      altEn: `Photo ${data.gallery.length + 1}`,
    };
    updateData({ gallery: [...data.gallery, newImg] });
  };

  const handleAddReview = () => {
    const newReview: Review = {
      id: generateId(),
      author: language === 'fr' ? 'Nouveau client' : 'New Client',
      rating: 5,
      text: language === 'fr' ? 'Excellent service !' : 'Excellent service!',
      textEn: 'Excellent service!',
      date: new Date().toISOString().split('T')[0],
      verified: true,
    };
    updateData({ reviews: [...data.reviews, newReview] });
  };

  const handleUpdateReview = (id: string, field: string, value: string | number) => {
    updateData({
      reviews: data.reviews.map(r => r.id === id ? { ...r, [field]: value } : r)
    });
  };

  const handleDeleteReview = (id: string) => {
    updateData({ reviews: data.reviews.filter(r => r.id !== id) });
  };

  const handleAddService = () => {
    const newService: Service = {
      id: generateId(),
      name: 'Nouveau service',
      nameEn: 'New Service',
      description: 'Description du service',
      descriptionEn: 'Service description',
      icon: 'sparkles',
    };
    updateData({ services: [...data.services, newService] });
  };

  const handleUpdateService = (id: string, field: string, value: string) => {
    updateData({
      services: data.services.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  const handleDeleteService = (id: string) => {
    updateData({ services: data.services.filter(s => s.id !== id) });
  };

  const handleSendAdminReply = () => {
    if (!adminReply.trim() || !selectedClientChat) return;
    const msg: Message = {
      id: generateId(),
      senderId: 'admin',
      senderName: 'Alice',
      receiverId: selectedClientChat,
      content: adminReply,
      timestamp: new Date().toISOString(),
      read: true,
    };
    addMessage(msg);
    setAdminReply('');
  };

  const handleUpdateBookingStatus = (bookingId: string, status: Booking['status']) => {
    updateBooking(bookingId, { status });
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('admin_dashboard') },
    { id: 'profile', icon: User, label: t('admin_profile') },
    { id: 'services', icon: Tag, label: t('admin_services') },
    { id: 'gallery', icon: Image, label: t('admin_gallery') },
    { id: 'reviews', icon: Star, label: t('admin_reviews') },
    { id: 'contacts', icon: Mail, label: t('admin_contacts') },
    { id: 'terms', icon: FileText, label: t('admin_terms') },
    { id: 'messages', icon: MessageSquare, label: t('admin_messages') },
    { id: 'bookings', icon: Calendar, label: t('admin_bookings') },
  ];

  const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: data.pricing.currency, minimumFractionDigits: 0 }).format(price);

  // ==================== RENDER SECTIONS ====================
  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-bold text-white">{t('admin_dashboard')}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: language === 'fr' ? 'Réservations' : 'Bookings', value: bookings.length, color: 'from-blue-500 to-blue-600', icon: Calendar },
          { label: language === 'fr' ? 'Messages' : 'Messages', value: messages.filter(m => m.senderId !== 'admin' && !m.read).length, color: 'from-green-500 to-green-600', icon: MessageSquare },
          { label: language === 'fr' ? 'Clients' : 'Clients', value: clientConversations.length, color: 'from-purple-500 to-purple-600', icon: User },
          { label: language === 'fr' ? 'Revenus estimés' : 'Est. Revenue', value: formatPrice(bookings.reduce((acc, b) => acc + b.totalAmount, 0)), color: 'from-[#d4af37] to-[#b8960c]', icon: Star },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon size={18} className="text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
      
      {/* Recent Bookings */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">{language === 'fr' ? 'Réservations récentes' : 'Recent Bookings'}</h3>
        {bookings.slice(0, 5).length === 0 ? (
          <p className="text-gray-500 text-sm">{language === 'fr' ? 'Aucune réservation' : 'No bookings'}</p>
        ) : (
          <div className="space-y-3">
            {bookings.slice(-5).reverse().map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">{b.clientName} - {b.service}</p>
                  <p className="text-gray-500 text-xs">{b.date} à {b.time}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  b.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                  b.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400' :
                  b.status === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                }`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-bold text-white">{t('admin_profile')}</h2>
      
      {/* Hero Image */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">{language === 'fr' ? 'Image principale' : 'Hero Image'}</h3>
        <div className="flex items-start gap-6">
          <div className="w-40 h-56 rounded-xl overflow-hidden bg-white/5 shrink-0">
            {data.profile.heroImage ? (
              <img src={data.profile.heroImage} alt="Hero" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">No image</div>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <label className="btn-outline-gold inline-flex items-center gap-2 cursor-pointer">
              <Upload size={16} />
              {t('admin_upload')}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'heroImage')} />
            </label>
          </div>
        </div>
      </div>

      {/* Profile Images */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">{language === 'fr' ? 'Photos de profil' : 'Profile Photos'}</h3>
          <button onClick={() => updateData({ profile: { ...data.profile, profileImages: [...data.profile.profileImages, { id: generateId(), url: '', alt: 'Photo', altEn: 'Photo' }] }})} className="text-[#d4af37] hover:text-[#f4e4bc] text-sm flex items-center gap-1"><Plus size={14} /> Add</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.profile.profileImages.map((img, i) => (
            <div key={img.id} className="aspect-square rounded-xl overflow-hidden bg-white/5 relative group">
              {img.url ? (
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">Empty</div>
              )}
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Upload size={20} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'profileImages', i)} />
              </label>
              <button
                onClick={() => updateData({ profile: { ...data.profile, profileImages: data.profile.profileImages.filter((_, idx) => idx !== i) } })}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Info Form */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">{language === 'fr' ? 'Informations du profil' : 'Profile Information'}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ['name', language === 'fr' ? 'Nom / Pseudonyme' : 'Name / Alias', data.profile.name],
            ['alias', 'Alias', data.profile.alias],
            ['age', t('about_age'), String(data.profile.age)],
            ['height', t('about_height'), data.profile.height],
            ['weight', t('about_weight'), data.profile.weight],
            ['eyes', t('about_eyes'), data.profile.eyes],
            ['hair', t('about_hair'), data.profile.hair],
            ['bust', t('about_bust'), data.profile.bust],
            ['ethnicity', t('about_ethnicity'), data.profile.ethnicity],
            ['location', t('about_location'), data.profile.location],
            ['languages', t('about_languages'), data.profile.languages.join(', ')],
          ].map(([field, label, value]) => (
            <div key={field}>
              <label className="block text-sm text-gray-400 mb-1">{label}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  if (field === 'languages') {
                    updateData({ profile: { ...data.profile, languages: e.target.value.split(',').map(s => s.trim()) } });
                  } else if (field === 'age') {
                    updateData({ profile: { ...data.profile, [field]: parseInt(e.target.value) || 0 } });
                  } else {
                    updateData({ profile: { ...data.profile, [field]: e.target.value } });
                  }
                }}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d4af37] outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Biographie (FR)</h3>
        <textarea
          value={data.profile.bio}
          onChange={(e) => updateData({ profile: { ...data.profile, bio: e.target.value } })}
          rows={6}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-[#d4af37] outline-none resize-none"
        />
        <h3 className="text-white font-semibold mt-4 mb-4">Biography (EN)</h3>
        <textarea
          value={data.profile.bioEn}
          onChange={(e) => updateData({ profile: { ...data.profile, bioEn: e.target.value } })}
          rows={6}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-[#d4af37] outline-none resize-none"
        />
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-white">{t('admin_services')}</h2>
        <button onClick={handleAddService} className="btn-gold text-sm flex items-center gap-1"><Plus size={16} /> {t('admin_add')}</button>
      </div>
      
      {/* Pricing */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">{t('pricing_title')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['hour', t('pricing_hour'), data.pricing.hour],
            ['twoHours', t('pricing_2hours'), data.pricing.twoHours],
            ['threeHours', t('pricing_3hours'), data.pricing.threeHours],
            ['night', t('pricing_night'), data.pricing.night],
            ['day', t('pricing_day'), data.pricing.day],
            ['weekend', t('pricing_weekend'), data.pricing.weekend],
            ['travel', t('pricing_travel'), data.pricing.travel],
          ].map(([field, label, value]) => (
            <div key={field}>
              <label className="block text-xs text-gray-500 mb-1">{label}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => updateData({ pricing: { ...data.pricing, [field]: Number(e.target.value) } })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d4af37] outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {data.services.map(service => (
          <div key={service.id} className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-medium">{language === 'fr' ? service.name : service.nameEn}</span>
              <button onClick={() => handleDeleteService(service.id)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"><Trash2 size={14} /> {t('admin_delete')}</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nom (FR)</label>
                <input value={service.name} onChange={(e) => handleUpdateService(service.id, 'name', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d4af37] outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Name (EN)</label>
                <input value={service.nameEn} onChange={(e) => handleUpdateService(service.id, 'nameEn', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d4af37] outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Description (FR)</label>
                <input value={service.description} onChange={(e) => handleUpdateService(service.id, 'description', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d4af37] outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Description (EN)</label>
                <input value={service.descriptionEn} onChange={(e) => handleUpdateService(service.id, 'descriptionEn', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d4af37] outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Icon (emoji)</label>
                <input value={service.icon} onChange={(e) => handleUpdateService(service.id, 'icon', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d4af37] outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Durée / Duration</label>
                <input value={service.duration || ''} onChange={(e) => handleUpdateService(service.id, 'duration', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d4af37] outline-none" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGallery = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-white">{t('admin_gallery')}</h2>
        <button onClick={handleAddGalleryImage} className="btn-gold text-sm flex items-center gap-1"><Plus size={16} /> {t('admin_add')}</button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.gallery.map((img, i) => (
          <div key={img.id} className="aspect-square rounded-xl overflow-hidden bg-white/5 relative group">
            {img.url ? (
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">Empty slot</div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label className="cursor-pointer p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <Upload size={18} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'gallery', i)} />
              </label>
              <button
                onClick={() => updateData({ gallery: data.gallery.filter((_, idx) => idx !== i) })}
                className="p-2 bg-red-500/50 rounded-lg hover:bg-red-500/70 transition-colors"
              >
                <Trash2 size={18} className="text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {data.gallery.length === 0 && (
        <div className="glass-card rounded-xl p-12 text-center text-gray-500">
          <Image size={48} className="mx-auto mb-4 opacity-30" />
          <p>{language === 'fr' ? 'Aucune image dans la galerie' : 'No images in gallery'}</p>
        </div>
      )}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-white">{t('admin_reviews')}</h2>
        <button onClick={handleAddReview} className="btn-gold text-sm flex items-center gap-1"><Plus size={16} /> {t('admin_add')}</button>
      </div>
      
      <div className="space-y-4">
        {data.reviews.map(review => (
          <div key={review.id} className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={review.author}
                  onChange={(e) => handleUpdateReview(review.id, 'author', e.target.value)}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d4af37] outline-none"
                />
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} onClick={() => handleUpdateReview(review.id, 'rating', star)} className={`text-lg ${star <= review.rating ? 'text-[#d4af37]' : 'text-gray-700'}`}>★</button>
                  ))}
                </div>
              </div>
              <button onClick={() => handleDeleteReview(review.id)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"><Trash2 size={14} /> {t('admin_delete')}</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Avis (FR)</label>
                <textarea
                  value={review.text}
                  onChange={(e) => handleUpdateReview(review.id, 'text', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d4af37] outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Review (EN)</label>
                <textarea
                  value={review.textEn}
                  onChange={(e) => handleUpdateReview(review.id, 'textEn', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#d4af37] outline-none resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-bold text-white">{t('admin_contacts')}</h2>
      <div className="glass-card rounded-xl p-6 space-y-4">
        {[
          ['email', 'Email', data.contacts.email],
          ['telegram', 'Telegram', data.contacts.telegram],
          ['telegramUrl', 'Telegram URL', data.contacts.telegramUrl],
          ['phone', 'Phone', data.contacts.phone],
        ].map(([field, label, value]) => (
          <div key={field}>
            <label className="block text-sm text-gray-400 mb-1">{label}</label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              value={value}
              onChange={(e) => updateData({ contacts: { ...data.contacts, [field]: e.target.value } })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#d4af37] outline-none"
            />
          </div>
        ))}
        <button onClick={() => alert(language === 'fr' ? 'Contacts sauvegardés !' : 'Contacts saved!')} className="btn-gold">
          <Save size={16} className="inline mr-2" />{t('admin_save')}
        </button>
      </div>
    </div>
  );

  const renderTerms = () => (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-bold text-white">{t('admin_terms')}</h2>
      <div className="glass-card rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Conditions Générales (FR)</label>
          <textarea
            value={data.terms.fr}
            onChange={(e) => updateData({ terms: { ...data.terms, fr: e.target.value } })}
            rows={15}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-[#d4af37] outline-none resize-none font-mono"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Terms & Conditions (EN)</label>
          <textarea
            value={data.terms.en}
            onChange={(e) => updateData({ terms: { ...data.terms, en: e.target.value } })}
            rows={15}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-[#d4af37] outline-none resize-none font-mono"
          />
        </div>
        <button onClick={() => alert(language === 'fr' ? 'Conditions sauvegardées !' : 'Terms saved!')} className="btn-gold">
          <Save size={16} className="inline mr-2" />{t('admin_save')}
        </button>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-bold text-white">{t('admin_messages')}</h2>
      <div className="grid lg:grid-cols-3 gap-6 min-h-[500px]">
        {/* Client list */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-semibold text-sm">{language === 'fr' ? 'Conversations' : 'Conversations'}</h3>
          </div>
          <div className="overflow-y-auto max-h-[500px]">
            {clientConversations.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">{language === 'fr' ? 'Aucune conversation' : 'No conversations'}</p>
            ) : (
              clientConversations.map(conv => (
                <button
                  key={conv.clientId}
                  onClick={() => setSelectedClientChat(conv.clientId)}
                  className={`w-full p-4 text-left border-b border-white/5 hover:bg-white/5 transition-colors ${
                    selectedClientChat === conv.clientId ? 'bg-[#d4af37]/10 border-l-2 border-l-[#d4af37]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm font-medium truncate">{conv.clientName}</p>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{conv.unread}</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs truncate mt-1">{conv.lastMsg?.content}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden flex flex-col">
          {selectedClientChat ? (
            <>
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-semibold">
                  {clientConversations.find(c => c.clientId === selectedClientChat)?.clientName}
                </h3>
                <button onClick={() => setSelectedClientChat(null)} className="text-gray-500 hover:text-white">
                  <XCircle size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[350px]">
                {currentConversation.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      msg.senderId === 'admin' ? 'bg-[#d4af37] text-[#0a0a0f]' : 'bg-white/10 text-white'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.senderId === 'admin' ? 'text-[#0a0a0f]/60' : 'text-gray-500'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={adminReply}
                    onChange={(e) => setAdminReply(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendAdminReply()}
                    placeholder={language === 'fr' ? 'Répondre à ce client...' : 'Reply to this client...'}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-[#d4af37] outline-none"
                  />
                  <button onClick={handleSendAdminReply} className="btn-gold px-4">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <MessageSquare size={48} className="opacity-20" />
              <p className="ml-4">{language === 'fr' ? 'Sélectionnez une conversation' : 'Select a conversation'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-bold text-white">{t('admin_bookings')}</h2>
      {bookings.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center text-gray-500">
          <Calendar size={48} className="mx-auto mb-4 opacity-30" />
          <p>{language === 'fr' ? 'Aucune réservation' : 'No bookings'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="glass-card rounded-xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                      booking.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400' :
                      booking.status === 'paid' ? 'bg-green-500/10 text-green-400' :
                      booking.status === 'completed' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {booking.status}
                    </span>
                    <span className="text-white font-medium">{booking.clientName}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span>📅 {booking.date} à {booking.time}</span>
                    <span>📦 {booking.service}</span>
                    <span>📍 {booking.locationType === 'my_place' ? 'Chez Alice' : booking.locationType === 'hotel' ? 'Hôtel' : 'Chez le client'}</span>
                    <span>📧 {booking.clientEmail}</span>
                  </div>
                  {booking.message && (
                    <p className="text-gray-500 text-sm italic">"{booking.message}"</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[#d4af37] font-semibold">{formatPrice(booking.totalAmount)}</p>
                    <p className="text-gray-500 text-xs">Dépôt: {formatPrice(booking.depositAmount)}</p>
                  </div>
                  <div className="flex gap-1">
                    {(['confirmed', 'paid', 'completed', 'cancelled'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => handleUpdateBookingStatus(booking.id, status)}
                        className={`px-2 py-1 text-xs rounded-lg capitalize transition-colors ${
                          booking.status === status ? 'bg-[#d4af37] text-[#0a0a0f]' : 'bg-white/10 text-gray-400 hover:bg-white/20'
                        }`}
                      >
                        {status === 'confirmed' ? '✓' : status === 'paid' ? '💰' : status === 'completed' ? '✓✓' : '✕'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'profile': return renderProfile();
      case 'services': return renderServices();
      case 'gallery': return renderGallery();
      case 'reviews': return renderReviews();
      case 'contacts': return renderContacts();
      case 'terms': return renderTerms();
      case 'messages': return renderMessages();
      case 'bookings': return renderBookings();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ===== FIXED TOP BAR - Hauteur fixe h-16 (64px) ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0a0a0f]/97 backdrop-blur-xl border-b border-white/5">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo + titre */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4e4bc] flex items-center justify-center shadow-lg shadow-[#d4af37]/20">
              <span className="text-[#0a0a0f] font-heading font-bold text-base">A</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="font-heading font-semibold gold-gradient text-lg">Alice Elite</span>
              <span className="text-gray-600 text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10">Admin</span>
            </div>
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-3">
            {/* Indicateur de section active sur mobile */}
            <span className="lg:hidden text-xs text-gray-500 max-w-[120px] truncate">
              {navItems.find(n => n.id === activeSection)?.label}
            </span>
            
            <button
              onClick={() => { adminLogout(); navigate('/'); }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-white/10 hover:border-red-400/30 rounded-xl transition-all"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">{t('admin_logout')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ===== ESPACE RESERVE pour le header fixe (h-16 = 64px) ===== */}
      <div className="h-16" aria-hidden="true" />

      {/* ===== CONTENU PRINCIPAL avec padding-bottom pour nav mobile ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-10">
        <div className="flex gap-6 lg:gap-8">
          
          {/* ===== SIDEBAR DESKTOP - sticky correctement positionne ===== */}
          <aside className="w-56 xl:w-64 shrink-0 hidden lg:block">
            <nav className="sticky top-6 glass-card rounded-2xl p-3 space-y-1 border border-white/5">
              <div className="px-3 py-2 mb-2 border-b border-white/5">
                <p className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold">{t('admin_title')}</p>
              </div>
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b8960c] text-[#0a0a0f] shadow-md shadow-[#d4af37]/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={17} className={activeSection === item.id ? '' : 'opacity-60'} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* ===== ZONE DE CONTENU PRINCIPALE ===== */}
          <main className="flex-1 min-w-0">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>
      </div>

      {/* ===== NAVIGATION MOBILE FIXE EN BAS ===== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f]/97 backdrop-blur-xl border-t border-white/5 safe-area-inset-bottom">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center justify-around py-2 gap-0.5 overflow-x-auto scrollbar-hide">
            {navItems.slice(0, 6).map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl min-w-[56px] transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-[#d4af37]/15 text-[#d4af37]'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <item.icon size={16} />
                <span className="text-[9px] font-medium leading-tight text-center whitespace-nowrap">{item.label}</span>
              </button>
            ))}
            {/* Plus button for remaining items */}
            <details className="group relative">
              <summary className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl min-w-[56px] text-gray-500 hover:text-gray-300 cursor-pointer list-none transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14" /></svg>
                <span className="text-[9px] font-medium">Plus</span>
              </summary>
              <div className="absolute bottom-full right-0 mb-2 w-48 glass-card rounded-xl p-2 shadow-2xl border border-white/10 hidden group-open:block">
                {navItems.slice(6).map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                      activeSection === item.id ? 'bg-[#d4af37]/15 text-[#d4af37]' : 'text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    <item.icon size={14} />
                    {item.label}
                  </button>
                ))}
              </div>
            </details>
          </div>
        </div>
      </nav>
    </div>
  );
}