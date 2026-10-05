import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: int;
  full_name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setUser(res.data.user);
      setToken(res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.access_token);
      return true;
    } catch {
      return false;
    }
  };

  const register = async (full_name: string, email: string, password: string, phone?: string) => {
    try {
      const res = await axios.post('/api/auth/register', { full_name, email, password, phone });
      setUser(res.data.user);
      setToken(res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.access_token);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'ORDER_MANAGER' || user?.role === 'CONTENT_MANAGER';

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
