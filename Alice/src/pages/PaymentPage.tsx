import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Bitcoin, CheckCircle, Copy, ExternalLink, ArrowLeft, Loader } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const INTERAC_EMAIL = import.meta.env.VITE_INTERAC_EMAIL || 'paiement@alice-elite.com';

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { bookings, updateBooking } = useData();
  const { client } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<'interac' | 'plisio' | 'stripe' | null>(null);
  const [plisioUrl, setPlisioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const booking = bookings.find(b => b.id === bookingId);
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    if (!booking && bookings.length > 0) navigate('/dashboard');
  }, [booking, bookings, navigate]);

  if (!booking) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency', currency: 'EUR', minimumFractionDigits: 0,
    }).format(amount);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInterac = async () => {
    setPaymentMethod('interac');
    await updateBooking(booking.id, { paymentMethod: 'interac', paymentStatus: 'pending' });
  };

  const handleStripe = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          amount: booking.depositAmount,
          orderId: booking.id,
          orderName: `Acompte - ${booking.service} - Alice Elite`,
          successUrl: `${window.location.origin}/dashboard`,
          cancelUrl: `${window.location.origin}/payment/${booking.id}`,
          clientEmail: client?.email || '',
        }),
      });

      const data = await res.json();

      if (data.url) {
        await updateBooking(booking.id, { paymentMethod: 'stripe', paymentStatus: 'pending' });
        window.location.href = data.url;
      } else {
        setError(language === 'fr' ? 'Erreur Stripe. Réessayez.' : 'Stripe error. Please retry.');
      }
    } catch {
      setError(language === 'fr' ? 'Erreur de connexion.' : 'Connection error.');
    }
    setLoading(false);
  };

  const handlePlisio = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/plisio-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          amount: booking.depositAmount,
          orderId: booking.id,
          orderName: `Acompte Réservation - Alice Elite`,
          successUrl: `${window.location.origin}/dashboard`,
          failUrl: `${window.location.origin}/payment/${booking.id}`,
        }),
      });

      const json = await res.json();

      if (json.status === 'success' && json.data?.invoice_url) {
        setPlisioUrl(json.data.invoice_url);
        setPaymentMethod('plisio');
        await updateBooking(booking.id, { paymentMethod: 'plisio', paymentStatus: 'pending' });
      } else {
        setError(language === 'fr' ? 'Erreur de création de facture crypto. Réessayez.' : 'Error creating crypto invoice.');
      }
    } catch {
      setError(language === 'fr' ? 'Erreur de connexion à Plisio.' : 'Connection error to Plisio.');
    }
    setLoading(false);
  };

  const referenceCode = `ALICE-${booking.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} />
          {language === 'fr' ? 'Retour au tableau de bord' : 'Back to dashboard'}
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Booking summary */}
          <div className="glass-card rounded-2xl p-6 mb-6">
            <h1 className="font-heading text-2xl font-bold text-white mb-4">
              💳 {language === 'fr' ? 'Paiement de l\'acompte' : 'Deposit Payment'}
            </h1>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>{language === 'fr' ? 'Date' : 'Date'}</span>
                <span className="text-white">{booking.date} à {booking.time}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Service</span>
                <span className="text-white">{booking.service}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Total</span>
                <span className="text-white">{formatPrice(booking.totalAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                <span className="text-gray-300 font-medium">{language === 'fr' ? 'Acompte à payer (60%)' : 'Deposit (60%)'}</span>
                <span className="text-[#d4af37] font-bold text-lg">{formatPrice(booking.depositAmount)}</span>
              </div>
            </div>
          </div>

          {/* Payment method selection */}
          {!paymentMethod && (
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-heading text-xl font-semibold text-white mb-6">
                {language === 'fr' ? 'Choisissez votre méthode de paiement' : 'Choose your payment method'}
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
              )}

              <div className="grid gap-4">
                {/* Stripe - temporairement masqué
                <button onClick={handleStripe} disabled={loading}
                  className="flex items-center gap-4 p-5 rounded-xl border-2 border-white/10 hover:border-[#d4af37]/50 bg-white/5 hover:bg-[#d4af37]/5 transition-all text-left group disabled:opacity-50">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    {loading ? <Loader className="text-purple-400 animate-spin" size={24} /> : <CreditCard className="text-purple-400" size={24} />}
                  </div>
                  <div>
                    <p className="text-white font-semibold">Carte bancaire (Stripe)</p>
                    <p className="text-gray-500 text-sm">Visa, Mastercard, Apple Pay, Google Pay...</p>
                  </div>
                </button>
                */}

                {/* Interac */}
                <button onClick={handleInterac}
                  className="flex items-center gap-4 p-5 rounded-xl border-2 border-white/10 hover:border-[#d4af37]/50 bg-white/5 hover:bg-[#d4af37]/5 transition-all text-left group">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <CreditCard className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Virement Interac</p>
                    <p className="text-gray-500 text-sm">{language === 'fr' ? 'Transfert bancaire rapide et sécurisé' : 'Fast and secure bank transfer'}</p>
                  </div>
                </button>

                {/* Plisio */}
                <button onClick={handlePlisio} disabled={loading}
                  className="flex items-center gap-4 p-5 rounded-xl border-2 border-white/10 hover:border-[#d4af37]/50 bg-white/5 hover:bg-[#d4af37]/5 transition-all text-left group disabled:opacity-50">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                    {loading ? <Loader className="text-orange-400 animate-spin" size={24} /> : <Bitcoin className="text-orange-400" size={24} />}
                  </div>
                  <div>
                    <p className="text-white font-semibold">Crypto (Plisio)</p>
                    <p className="text-gray-500 text-sm">Bitcoin, Ethereum, USDT...</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Interac instructions */}
          {paymentMethod === 'interac' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <CreditCard className="text-blue-400" size={20} />
                </div>
                <h2 className="font-heading text-xl font-semibold text-white">Instructions Interac</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-500 text-xs mb-1">Étape 1 — Envoyez à</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-mono text-sm">{INTERAC_EMAIL}</span>
                    <button onClick={() => handleCopy(INTERAC_EMAIL)} className="text-[#d4af37]">
                      {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-500 text-xs mb-1">Étape 2 — Montant exact</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#d4af37] font-bold text-xl">{formatPrice(booking.depositAmount)}</span>
                    <button onClick={() => handleCopy(booking.depositAmount.toString())} className="text-[#d4af37]">
                      {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-500 text-xs mb-1">Étape 3 — Référence à mettre en message</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-mono font-bold">{referenceCode}</span>
                    <button onClick={() => handleCopy(referenceCode)} className="text-[#d4af37]">
                      {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-yellow-300 text-sm">
                  ⚠️ Votre réservation sera confirmée dès réception du paiement (sous 24h).
                </div>
                <Link to="/dashboard" className="btn-gold w-full flex items-center justify-center gap-2 py-4 rounded-xl mt-4">
                  <CheckCircle size={18} /> Compris, voir mes réservations
                </Link>
              </div>
            </motion.div>
          )}

          {/* Plisio */}
          {paymentMethod === 'plisio' && plisioUrl && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Bitcoin className="text-orange-400" size={20} />
                </div>
                <h2 className="font-heading text-xl font-semibold text-white">Paiement Crypto</h2>
              </div>
              <a href={plisioUrl} target="_blank" rel="noopener noreferrer"
                className="btn-gold w-full flex items-center justify-center gap-2 py-4 rounded-xl mb-4">
                <ExternalLink size={18} /> Payer avec Crypto
              </a>
              <div className="bg-white/5 rounded-xl p-4 text-sm text-gray-500">
                🔒 Paiement sécurisé via Plisio.
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
