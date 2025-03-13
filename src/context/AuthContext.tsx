'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'FARMER' | 'CONSUMER' | 'SUPPLIER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  location?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (userData: Omit<User, 'id'> & { password: string }) => void;
}

// Mock user data
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'farmer@test.com',
    password: 'test123',
    name: 'Raj Kumar',
    role: 'FARMER',
    location: 'Karnataka',
    phone: '9876543210'
  },
  {
    id: '2',
    email: 'consumer@test.com',
    password: 'test123',
    name: 'Priya Singh',
    role: 'CONSUMER',
    location: 'Mumbai',
    phone: '9876543211'
  },
  {
    id: '3',
    email: 'supplier@test.com',
    password: 'test123',
    name: 'Amit Patel',
    role: 'SUPPLIER',
    location: 'Gujarat',
    phone: '9876543212'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Clear any existing auth data on first mount
    if (typeof window !== 'undefined' && !initialized) {
      localStorage.removeItem('user');
      setInitialized(true);
    }
  }, [initialized]);

  const login = (email: string, password: string) => {
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = (userData: Omit<User, 'id'> & { password: string }) => {
    const newUser = {
      ...userData,
      id: String(mockUsers.length + 1)
    };
    mockUsers.push(newUser);
    
    // Auto login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
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