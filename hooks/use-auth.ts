// hooks/use-auth.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = { uid: string; email: string } | null;

interface AuthStore {
  user: User;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  continueAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,

  login: async (email, password) => {
    // Ganti dengan Firebase / Supabase / API kamu
    await new Promise((r) => setTimeout(r, 1000)); // simulasi
    const mockUser = { uid: '123', email };
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    set({ user: mockUser, isLoading: false });
  },

  continueAsGuest: async () => {
    const guest = { uid: 'guest', email: 'guest@focustask.app' };
    await AsyncStorage.setItem('user', JSON.stringify(guest));
    set({ user: guest, isLoading: false });
  },

  logout: async () => {
    await AsyncStorage.removeItem('user');
    set({ user: null, isLoading: false });
  },
}));

// Init auth state
useAuth.getState().isLoading = true;
AsyncStorage.getItem('user').then((str) => {
  if (str) {
    useAuth.setState({ user: JSON.parse(str), isLoading: false });
  } else {
    useAuth.setState({ isLoading: false });
  }
});