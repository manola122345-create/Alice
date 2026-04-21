import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Bitcoin, CheckCircle, Copy, ExternalLink, ArrowLeft, Loader } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

const PLISIO_SECRET_KEY = import.meta.env.VITE_PLISIO_SECRET_KEY || '';
const INTERAC_EMAIL = import.meta.env.VITE_INTERAC_EMAIL || 'paiement@alice-elite.com';

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { bookings, updateBooking } = useData();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<'interac' | 'plisio' | null>(null);
  const [plisioUrl, setPlisioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const booking = bookings.find(b => b.id === bookingId);

  useEffect(() => {
    if (!booking && bookings.length > 0) {
      navigate('/dashboard');
    }
  }, [booking, bookings, navigate]);

  if (!booking) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency', currency: 'EUR', minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInterac = async () => {
    setPaymentMethod('interac');
    await updateBooking(booking.id, { paymentMethod: 'interac', paymentStatus: 'pending' });
  };

  const handlePlisio = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        api_key: PLISIO_SECRET_KEY,
        currency: 'USDT',
        amount: booking.depositAmount.toString(),
        order_number: booking.id,
        order_name: `Acompte Réservation - Alice Elite`,
        success_url: `${window.location.origin}/dashboard`,
        fail_url: `${window.location.origin}/payment/${booking.id}`,
      });

      const res = await fetch(`https://plisio.net/api/v1/invoices/new?${params}`);
      const json = await res.json();

      if (json.status === 'success' && json.data?.invoice_url) {
        setPlisioUrl(json.data.invoice_url);
        setPaymentMethod('plisio');
        await updateBooking(booking.id, { paymentMethod: 'plisio', paymentStatus: 'pending' });
      } else {
        setError(language === 'fr' ? 'Erreur de création de facture crypto. Réessayez.' : 'Error creating crypto invoice. Please retry.');
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
        {/* Back button */}
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} />
          {language === 'fr' ? 'Retour au tableau de bord' : 'Back to dashboard'}
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Booking summary */}
          <div className="glass-card rounded-2xl p-6 mb-6">
            <h1 className="font-heading text-2xl font-bold text-white mb-4">
              {language === 'fr' ? '💳 Paiement de l\'acompte' : '💳 Deposit Payment'}
            </h1>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>{language === 'fr' ? 'Réservation' : 'Booking'}</span>
                <span className="text-white">{booking.date} à {booking.time}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>{language === 'fr' ? 'Service' : 'Service'}</span>
                <span className="text-white">{booking.service}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>{language === 'fr' ? 'Total' : 'Total'}</span>
                <span className="text-white">{formatPrice(booking.totalAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                <span className="text-gray-300 font-medium">{language === 'fr' ? 'Acompte à payer (60%)' : 'Deposit to pay (60%)'}</span>
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
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="grid gap-4">
                {/* Interac */}
                <button
                  onClick={handleInterac}
                  className="flex items-center gap-4 p-5 rounded-xl border-2 border-white/10 hover:border-[#d4af37]/50 bg-white/5 hover:bg-[#d4af37]/5 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <CreditCard className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Virement Interac</p>
                    <p className="text-gray-500 text-sm">
                      {language === 'fr' ? 'Transfert bancaire rapide et sécurisé' : 'Fast and secure bank transfer'}
                    </p>
                  </div>
                </button>

                {/* Plisio (Crypto) */}
                <button
                  onClick={handlePlisio}
                  disabled={loading}
                  className="flex items-center gap-4 p-5 rounded-xl border-2 border-white/10 hover:border-[#d4af37]/50 bg-white/5 hover:bg-[#d4af37]/5 transition-all text-left group disabled:opacity-50"
                >
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                    {loading ? (
                      <Loader className="text-orange-400 animate-spin" size={24} />
                    ) : (
                      <Bitcoin className="text-orange-400" size={24} />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold">Crypto (Plisio)</p>
                    <p className="text-gray-500 text-sm">
                      {language === 'fr' ? 'Bitcoin, Ethereum, USDT et plus...' : 'Bitcoin, Ethereum, USDT and more...'}
                    </p>
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
                  <p className="text-gray-500 text-xs mb-1">{language === 'fr' ? 'Étape 1 — Envoyez l\'acompte à' : 'Step 1 — Send deposit to'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-mono text-sm">{INTERAC_EMAIL}</span>
                    <button onClick={() => handleCopy(INTERAC_EMAIL)} className="text-[#d4af37] hover:text-[#f4e4bc] transition-colors">
                      {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-500 text-xs mb-1">{language === 'fr' ? 'Étape 2 — Montant exact à envoyer' : 'Step 2 — Exact amount to send'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#d4af37] font-bold text-xl">{formatPrice(booking.depositAmount)}</span>
                    <button onClick={() => handleCopy(booking.depositAmount.toString())} className="text-[#d4af37] hover:text-[#f4e4bc] transition-colors">
                      {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-500 text-xs mb-1">{language === 'fr' ? 'Étape 3 — Mettez ce code en message/référence' : 'Step 3 — Add this code as message/reference'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-mono font-bold">{referenceCode}</span>
                    <button onClick={() => handleCopy(referenceCode)} className="text-[#d4af37] hover:text-[#f4e4bc] transition-colors">
                      {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-yellow-300 text-sm">
                  ⚠️ {language === 'fr'
                    ? 'Votre réservation sera confirmée dès réception du paiement (généralement sous 24h).'
                    : 'Your booking will be confirmed upon receipt of payment (usually within 24h).'}
                </div>

                <Link to="/dashboard" className="btn-gold w-full flex items-center justify-center gap-2 py-4 rounded-xl mt-4">
                  <CheckCircle size={18} />
                  {language === 'fr' ? 'Compris, voir mes réservations' : 'Understood, view my bookings'}
                </Link>
              </div>
            </motion.div>
          )}

          {/* Plisio payment */}
          {paymentMethod === 'plisio' && plisioUrl && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Bitcoin className="text-orange-400" size={20} />
                </div>
                <h2 className="font-heading text-xl font-semibold text-white">Paiement Crypto (Plisio)</h2>
              </div>

              <p className="text-gray-400 text-sm mb-6">
                {language === 'fr'
                  ? 'Cliquez sur le bouton ci-dessous pour accéder à la page de paiement sécurisée Plisio. Vous pourrez choisir votre crypto-monnaie préférée.'
                  : 'Click the button below to access the secure Plisio payment page. You can choose your preferred cryptocurrency.'}
              </p>

              <a
                href={plisioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full flex items-center justify-center gap-2 py-4 rounded-xl mb-4"
              >
                <ExternalLink size={18} />
                {language === 'fr' ? 'Payer maintenant avec Crypto' : 'Pay Now with Crypto'}
              </a>

              <div className="bg-white/5 rounded-xl p-4 text-sm text-gray-500">
                {language === 'fr'
                  ? '🔒 Paiement sécurisé via Plisio. Votre réservation sera confirmée automatiquement après confirmation de la transaction.'
                  : '🔒 Secure payment via Plisio. Your booking will be automatically confirmed after transaction confirmation.'}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
