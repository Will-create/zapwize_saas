import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';

// Define user type
type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

// Auth context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyAccount: (token: string) => Promise<void>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  updatePassword: async () => {},
  resetPassword: async () => {},
  verifyAccount: async () => {},
});

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await authService.getProfile();
        if (response.success) {
          setUser(response.value);
        }
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      initAuth();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Login functionality
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        localStorage.setItem('token', response.value.token);
        setUser(response.value.user);
      }
    } catch (error) {
      throw error;
    }
  };

  // Register functionality
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authService.register({ name, email, password });
      if (response.success) {
        localStorage.setItem('token', response.value.token);
        setUser(response.value.user);
      }
    } catch (error) {
      throw error;
    }
  };

  // Logout functionality
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    }
  };

  // Update profile
  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await authService.updateProfile(data);
      if (response.success) {
        setUser({ ...user!, ...response.value });
      }
    } catch (error) {
      throw error;
    }
  };

  // Update password
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await authService.updatePassword({ currentPassword, newPassword });
    } catch (error) {
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  // Verify account
  const verifyAccount = async (token: string) => {
    try {
      await authService.verifyAccount(token);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        resetPassword,
        verifyAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);