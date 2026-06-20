import { User } from '../types';

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

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.status === 401) throw new Error('Username atau password salah');
    if (!res.ok) throw new Error(`Login error ${res.status}`);
    const data = await res.json();

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
