-- =============================================
-- ALICE ELITE — Schéma Supabase
-- Copiez-coller dans SQL Editor de Supabase
-- =============================================

-- Table clients
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table réservations
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  duration TEXT NOT NULL,
  service TEXT NOT NULL,
  location_type TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','paid','completed','cancelled')),
  deposit_paid BOOLEAN DEFAULT FALSE,
  total_amount DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT DEFAULT '',
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','pending','paid')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table messages
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Désactiver RLS (Row Level Security) pour accès simple
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
