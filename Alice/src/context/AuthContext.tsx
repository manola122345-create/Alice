import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, TABLES } from '../lib/supabase';
import { Client } from '../lib/data';

interface AuthContextType {
  client: Client | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const CURRENT_CLIENT_KEY = 'alice_current_client';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Client | null>(() => {
    const saved = localStorage.getItem(CURRENT_CLIENT_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (client) {
      localStorage.setItem(CURRENT_CLIENT_KEY, JSON.stringify(client));
    } else {
      localStorage.removeItem(CURRENT_CLIENT_KEY);
    }
  }, [client]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.CLIENTS)
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) return false;

      const clientData: Client = {
        id: data.id,
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone || '',
        createdAt: data.created_at,
      };
      setClient(clientData);
      return true;
    } catch {
      return false;
    }
  };

  const register = async (userData: Omit<Client, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const { data: existing } = await supabase
        .from(TABLES.CLIENTS)
        .select('id')
        .eq('email', userData.email)
        .maybeSingle();

      if (existing) return false;

      const { data, error } = await supabase
        .from(TABLES.CLIENTS)
        .insert({
          email: userData.email,
          password: userData.password,
          name: userData.name,
          phone: userData.phone,
        })
        .select()
        .single();

      if (error || !data) return false;

      const clientData: Client = {
        id: data.id,
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone || '',
        createdAt: data.created_at,
      };
      setClient(clientData);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => setClient(null);

  return (
    <AuthContext.Provider value={{ client, login, register, logout, isAuthenticated: !!client }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
