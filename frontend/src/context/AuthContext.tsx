'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { usePathname, useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await api.get<'user'>('/auth/profile'); // Fetches user from backend (protected route)
        setUser(res.data as User);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      // Backend should set HTTP-only cookie, so no need to store token in client-side storage
      const profileRes = await api.get<'user'>('/auth/profile');
      setUser(profileRes.data as User);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      setUser(null);
      throw error; // Re-throw for UI to handle
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/register', { email, password, name });
      const profileRes = await api.get<'user'>('/auth/profile');
      setUser(profileRes.data as User);
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration failed', error);
      setUser(null);
      throw error; // Re-throw for UI to handle
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.post('/auth/logout'); // Assuming a logout endpoint on backend that clears http-only cookie
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
