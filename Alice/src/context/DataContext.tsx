import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase, TABLES } from '../lib/supabase';
import { SiteData, defaultSiteData, Booking, Message } from '../lib/data';

interface DataContextType {
  data: SiteData;
  updateData: (updates: Partial<SiteData>) => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => Promise<void>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<void>;
  messages: Message[];
  addMessage: (message: Message) => Promise<void>;
  markMessageRead: (id: string) => Promise<void>;
  getConversation: (clientId: string) => Message[];
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
const DATA_KEY = 'alice_site_data';

function loadSiteData(): SiteData {
  const saved = localStorage.getItem(DATA_KEY);
  if (saved) {
    try { return { ...defaultSiteData, ...JSON.parse(saved) }; }
    catch { return defaultSiteData; }
  }
  return defaultSiteData;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(loadSiteData);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }, [data]);

  const refreshData = useCallback(async () => {
    try {
      const [bookingsRes, messagesRes] = await Promise.all([
        supabase.from(TABLES.BOOKINGS).select('*').order('created_at', { ascending: false }),
        supabase.from(TABLES.MESSAGES).select('*').order('created_at', { ascending: true }),
      ]);

      if (bookingsRes.data) {
        setBookings(bookingsRes.data.map(b => ({
          id: b.id,
          clientId: b.client_id,
          clientName: b.client_name,
          clientEmail: b.client_email,
          date: b.date,
          time: b.time,
          duration: b.duration,
          service: b.service,
          locationType: b.location_type,
          message: b.message || '',
          status: b.status,
          depositPaid: b.deposit_paid,
          totalAmount: b.total_amount,
          depositAmount: b.deposit_amount,
          paymentMethod: b.payment_method || '',
          paymentStatus: b.payment_status || 'unpaid',
          createdAt: b.created_at,
        })));
      }

      if (messagesRes.data) {
        setMessages(messagesRes.data.map(m => ({
          id: m.id,
          senderId: m.sender_id,
          receiverId: m.receiver_id,
          content: m.content,
          read: m.read,
          timestamp: m.created_at,
        })));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const updateData = (updates: Partial<SiteData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const addBooking = async (booking: Booking) => {
    try {
      const { error } = await supabase.from(TABLES.BOOKINGS).insert({
        id: booking.id,
        client_id: booking.clientId,
        client_name: booking.clientName,
        client_email: booking.clientEmail,
        date: booking.date,
        time: booking.time,
        duration: booking.duration,
        service: booking.service,
        location_type: booking.locationType,
        message: booking.message,
        status: booking.status,
        deposit_paid: booking.depositPaid,
        total_amount: booking.totalAmount,
        deposit_amount: booking.depositAmount,
        payment_method: booking.paymentMethod || '',
        payment_status: booking.paymentStatus || 'unpaid',
      });
      if (!error) {
        setBookings(prev => [booking, ...prev]);
      }
    } catch (err) {
      console.error('Error adding booking:', err);
    }
  };

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.depositPaid !== undefined) dbUpdates.deposit_paid = updates.depositPaid;
      if (updates.paymentMethod !== undefined) dbUpdates.payment_method = updates.paymentMethod;
      if (updates.paymentStatus !== undefined) dbUpdates.payment_status = updates.paymentStatus;

      await supabase.from(TABLES.BOOKINGS).update(dbUpdates).eq('id', id);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    } catch (err) {
      console.error('Error updating booking:', err);
    }
  };

  const addMessage = async (message: Message) => {
    try {
      const { error } = await supabase.from(TABLES.MESSAGES).insert({
        id: message.id,
        sender_id: message.senderId,
        receiver_id: message.receiverId,
        content: message.content,
        read: message.read,
      });
      if (!error) {
        setMessages(prev => [...prev, message]);
      }
    } catch (err) {
      console.error('Error adding message:', err);
    }
  };

  const markMessageRead = async (id: string) => {
    try {
      await supabase.from(TABLES.MESSAGES).update({ read: true }).eq('id', id);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    } catch (err) {
      console.error('Error marking message read:', err);
    }
  };

  const getConversation = (clientId: string): Message[] => {
    return messages.filter(m =>
      (m.senderId === clientId && m.receiverId === 'admin') ||
      (m.senderId === 'admin' && m.receiverId === clientId)
    );
  };

  return (
    <DataContext.Provider value={{
      data, updateData,
      bookings, addBooking, updateBooking,
      messages, addMessage, markMessageRead,
      getConversation, refreshData,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
