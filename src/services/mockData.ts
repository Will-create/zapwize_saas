// Mock user data
export const mockUser = {
  id: 'usr_123',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: null,
};

// Mock successful response helper
export const mockSuccess = <T>(data: T) => ({
  success: true,
  value: data,
});

// Mock error response helper
export const mockError = (message: string) => ({
  success: false,
  error: message,
});