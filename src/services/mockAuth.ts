import { mockUser, mockSuccess, mockError } from './mockData';

// Simulated delay to mimic API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  login: async (email: string, password: string) => {
    await delay(800);
    
    if (email === 'john@example.com' && password === 'password123') {
      return mockSuccess({
        user: mockUser,
        token: 'mock_jwt_token',
      });
    }
    
    throw new Error('Invalid email or password');
  },
  
  register: async (data: { name: string; email: string; password: string }) => {
    await delay(800);
    
    if (data.email === 'john@example.com') {
      throw new Error('Email already in use');
    }
    
    return mockSuccess({
      user: {
        ...mockUser,
        name: data.name,
        email: data.email,
      },
      token: 'mock_jwt_token',
    });
  },
  
  getProfile: async () => {
    await delay(500);
    return mockSuccess(mockUser);
  },
  
  logout: async () => {
    await delay(300);
    return mockSuccess(null);
  },
  
  updateProfile: async (data: any) => {
    await delay(500);
    return mockSuccess({
      ...mockUser,
      ...data,
    });
  },
  
  resetPassword: async (email: string) => {
    await delay(800);
    
    if (email === 'unknown@example.com') {
      throw new Error('Email not found');
    }
    
    return mockSuccess(null);
  },
  
  verifyAccount: async (token: string) => {
    await delay(800);
    
    if (token === 'invalid') {
      throw new Error('Invalid or expired verification token');
    }
    
    return mockSuccess(null);
  },
  
  updatePassword: async (data: { currentPassword: string; newPassword: string }) => {
    await delay(800);
    
    if (data.currentPassword !== 'password123') {
      throw new Error('Current password is incorrect');
    }
    
    return mockSuccess(null);
  },
};