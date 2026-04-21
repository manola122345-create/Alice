import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Calendar, MessageSquare, Clock, CheckCircle, XCircle, ArrowRight, Send, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Message, generateId } from '../lib/data';

export default function ClientDashboard() {
  const { t, language } = useLanguage();
  const { client, logout } = useAuth();
  const { bookings, messages, addMessage, getConversation } = useData();
  
  const [activeTab, setActiveTab] = useState<'bookings' | 'messages' | 'profile'>('bookings');
  const [newMessage, setNewMessage] = useState('');

  const myBookings = bookings.filter(b => b.clientId === client?.id).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).reverse();
  
  const conversation = client ? getConversation(client.id) : [];
  const unreadCount = conversation.filter(m => m.senderId !== client?.id && !m.read).length;

  const handleSendMessage = () => {
    if (!newMessage.trim() || !client) return;
    const message: Message = {
      id: generateId(),
      senderId: client.id,
      senderName: client.name,
      receiverId: 'admin',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };
    addMessage(message);
    setNewMessage('');
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      paid: 'bg-green-500/10 text-green-400 border-green-500/20',
      completed: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    const labels: Record<string, string> = {
      pending: language === 'fr' ? 'En attente' : 'Pending',
      confirmed: language === 'fr' ? 'Confirmé' : 'Confirmed',
      paid: language === 'fr' ? 'Payé' : 'Paid',
      completed: language === 'fr' ? 'Terminé' : 'Completed',
      cancelled: language === 'fr' ? 'Annulé' : 'Cancelled',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${styles[status] || ''}`}>
        {labels[status] || status}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency', currency: 'EUR', minimumFractionDigits: 0,
    }).format(price);
  };

  if (!client) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">{language === 'fr' ? 'Veuillez vous connecter' : 'Please login'}</p>
          <Link to="/login" className="btn-gold inline-block">{t('nav_login')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-white">
                {t('dashboard_welcome')}, {client.name.split(' ')[0]}!
              </h1>
              <p className="text-gray-500 mt-1">{t('dashboard_title')}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 border border-white/10 rounded-lg hover:border-red-400/30 transition-all self-start"
            >
              <LogOut size={16} />
              {t('nav_logout')}
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {([['bookings', t('dashboard_bookings'), Calendar] as const, ['messages', `${t('dashboard_messages')} ${unreadCount > 0 ? `(${unreadCount})` : ''}`, MessageSquare] as const, ['profile', t('dashboard_profile'), User] as const]).map(([tab, label, Icon]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-[#d4af37] text-[#0a0a0f]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {myBookings.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <Calendar size={48} className="mx-auto text-gray-700 mb-4" />
                  <p className="text-gray-500 mb-4">{language === 'fr' ? 'Aucune réservation pour le moment' : 'No bookings yet'}</p>
                  <Link to="/booking" className="btn-gold inline-flex items-center gap-2">
                    {t('nav_booking')} <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                myBookings.map((booking) => (
                  <div key={booking.id} className="glass-card rounded-xl p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          {getStatusBadge(booking.status)}
                          <span className="text-white font-medium">{booking.service}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1"><Calendar size={14} />{booking.date}</span>
                          <span className="flex items-center gap-1"><Clock size={14} />{booking.time}</span>
                          <span>{booking.locationType === 'my_place' ? '🏠 Chez moi' : booking.locationType === 'hotel' ? '🏢 Hôtel' : '🏨 Chez vous'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#d4af37] font-semibold text-lg">{formatPrice(booking.totalAmount)}</p>
                        <p className="text-gray-500 text-xs">{language === 'fr' ? 'Acompte:' : 'Deposit:'} {formatPrice(booking.depositAmount)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="h-[400px] overflow-y-auto p-6 space-y-4">
                {conversation.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="ml-4">{t('messages_no_messages')}</p>
                  </div>
                ) : (
                  conversation.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === client?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        msg.senderId === client?.id
                          ? 'bg-[#d4af37] text-[#0a0a0f]'
                          : 'bg-white/10 text-white'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.senderId === client?.id ? 'text-[#0a0a0f]/60' : 'text-gray-500'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Message input */}
              <div className="border-t border-white/10 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={t('messages_type')}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#d4af37] outline-none transition-all"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="btn-gold px-6 flex items-center gap-2"
                  >
                    <Send size={16} />
                    {t('messages_send')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4e4bc] flex items-center justify-center">
                  <span className="text-[#0a0a0f] font-heading font-bold text-3xl">{client.name.charAt(0)}</span>
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white">{client.name}</h2>
                  <p className="text-gray-400">{client.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Email', client.email],
                  ['Téléphone', client.phone || '-'],
                  [language === 'fr' ? 'Membre depuis' : 'Member since', new Date(client.createdAt).toLocaleDateString()],
                  ['ID', client.id],
                ].map(([label, value]) => (
                  <div key={label} className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-white font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}