import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';
import { extractErrorMessage } from '../utils/errorHandler';
import { useNavigate } from 'react-router-dom';

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
      
      // Handle array response format
      if (Array.isArray(response)) {
        const firstItem = response[0];
        
        // Check if the response indicates an error
        if (!firstItem.success) {
          throw new Error(firstItem.error || firstItem.value || 'Login failed');
        }
        
        // If successful, extract the token and user data
        if (firstItem.token) {
          localStorage.setItem('token', firstItem.token);
          setUser(firstItem.user || { email });
        }
        return firstItem;
      } 
      // Handle object response format
      else if (response && response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user || { email });
        return response;
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
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
      console.error('Register error:', error);
      throw new Error(extractErrorMessage(error));
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
      console.error('Update profile error:', error);
      throw new Error(extractErrorMessage(error));
    }
  };

  // Update password
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await authService.updatePassword({ currentPassword, newPassword });
    } catch (error) {
      console.error('Update password error:', error);
      throw new Error(extractErrorMessage(error));
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error(extractErrorMessage(error));
    }
  };

  // Verify account
  const verifyAccount = async (token: string) => {
    try {
      await authService.verifyAccount(token);
    } catch (error) {
      console.error('Verify account error:', error);
      throw new Error(extractErrorMessage(error));
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