import { create, StateCreator } from 'zustand';
import api from '../lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

const createAuthStore: StateCreator<AuthState> = (set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('admin_token'),

  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = data.data;
    const adminRoles = ['super_admin', 'support', 'employee', 'freelancer'];
    if (!adminRoles.includes(user.role)) {
      throw new Error('Access denied. Admin privileges required.');
    }
    localStorage.setItem('admin_token', accessToken);
    localStorage.setItem('admin_refresh_token', refreshToken);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh_token');
    set({ user: null, isAuthenticated: false });
  },

  fetchProfile: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.data, isAuthenticated: true });
    } catch {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
      set({ user: null, isAuthenticated: false });
    }
  },
});

export const useAuthStore = create<AuthState>((set, get) => {
  const store = createAuthStore(set, get, undefined as any);
  
  // Initialize on app load
  if (store.isAuthenticated) {
    store.fetchProfile().catch(() => {
      set({ isAuthenticated: false, user: null });
    });
  }
  
  return store;
});
