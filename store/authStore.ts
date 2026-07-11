import { create } from 'zustand';
import { createClient } from '@/app/lib/supabase/client';

interface AuthState {
  user: any | null;
  loading: boolean;
  initialized: boolean;
  fetchUser: () => Promise<void>;
  setUser: (user: any | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,
  fetchUser: async () => {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      set({ user, loading: false, initialized: true });
      
      // Also set up listener for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user || null, loading: false });
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      set({ user: null, loading: false, initialized: true });
    }
  },
  setUser: (user) => set({ user }),
}));
