import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Contexts
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import AgeVerification from './components/AgeVerification';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Pricing from './pages/Pricing';
import Reviews from './pages/Reviews';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PaymentPage from './pages/PaymentPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AdminAccess({ onOpen }: { onOpen: () => void }) {
  
  // === METHODE 1: Raccourci clavier secret (Ctrl + Shift + A) ===
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);

  // === METHODE 2: Code Konami secret ===
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKonami = (e: KeyboardEvent) => {
      if (e.key !== konamiCode[konamiIndex]) {
        konamiIndex = 0;
        if (e.key === konamiCode[0]) konamiIndex = 1;
        return;
      }
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        onOpen();
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKonami);
    return () => window.removeEventListener('keydown', handleKonami);
  }, [onOpen]);

  // === METHODE 3: Evenement custom depuis le Footer (long-press logo) ===
  useEffect(() => {
    const handleAdminEvent = () => onOpen();
    window.addEventListener('admin:open-login', handleAdminEvent);
    return () => window.removeEventListener('admin:open-login', handleAdminEvent);
  }, [onOpen]);

  return null;
}

function AppContent() {
  const [ageVerified, setAgeVerified] = useState(() => {
    return localStorage.getItem('alice_age_verified') === 'true';
  });
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const openAdminLogin = () => setShowAdminLogin(true);

  // Check for secret URL parameter ?admin=access
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'access' || params.get('admin') === 'login' || params.get('panel') === 'admin') {
      setShowAdminLogin(true);
      // Clean URL without reload
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  if (!ageVerified) {
    return (
      <LanguageProvider>
        <AgeVerification
          onVerified={() => {
            localStorage.setItem('alice_age_verified', 'true');
            setAgeVerified(true);
          }}
          onDeclined={() => window.location.href = 'https://www.google.com'}
        />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <AdminAuthProvider>
            <Router>
              <ScrollToTop />
              
              {/* Secret admin access methods */}
              <AdminAccess onOpen={openAdminLogin} />

              {/* Admin Login Modal */}
              <AnimatePresence>
                {showAdminLogin && (
                  <>
                    <div 
                      className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
                      onClick={() => setShowAdminLogin(false)}
                    />
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
                      <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                        <AdminLogin onClose={() => setShowAdminLogin(false)} />
                      </div>
                    </div>
                  </>
                )}
              </AnimatePresence>

              {/* Main App */}
              <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
                <Header />
                
                <main>
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/gallery" element={<Gallery />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/reviews" element={<Reviews />} />
                      <Route path="/booking" element={<Booking />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/dashboard" element={<ClientDashboard />} />
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/payment/:bookingId" element={<PaymentPage />} />
                    </Routes>
                  </AnimatePresence>
                </main>

                <Footer />
              </div>
            </Router>
          </AdminAuthProvider>
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default function App() {
  return <AppContent />;
}
