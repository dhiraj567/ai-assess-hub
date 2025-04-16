
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, userType: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development
const MOCK_USERS = [
  {
    id: '1',
    username: 'hr_admin',
    email: 'hr@evalverse.com',
    password: 'password123',
    userType: 'HR' as UserRole,
    dateCreated: new Date().toISOString()
  },
  {
    id: '2',
    username: 'candidate1',
    email: 'candidate@evalverse.com',
    password: 'password123',
    userType: 'Candidate' as UserRole,
    dateCreated: new Date().toISOString()
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('evalverse_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // Create user object without password
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Save to state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('evalverse_user', JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string, userType: UserRole) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        email,
        userType,
        dateCreated: new Date().toISOString()
      };
      
      // Save to state and localStorage
      setUser(newUser);
      localStorage.setItem('evalverse_user', JSON.stringify(newUser));
      
      // In a real app, you would save to database here
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('evalverse_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
