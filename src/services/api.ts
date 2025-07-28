import axios from 'axios';

const BASE_URL = 'https://zapwize.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-token'] = token;
    }
    return config;
  },
  (error: any) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    console.error('Response error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API request wrapper following the backend pattern
const makeApiRequest = async (schema: string, data?: any) => {
  try {
    const payload = {
      schema,
      ...(data && { data }),
    };
    
    console.log('API Request:', { schema, data });
    const response = await api.post('/api/', payload);
    console.log('API Response:', response);
    
    return response.data;
  } catch (error: any) {
    console.error('API Error:', {
      schema,
      data,
      error: error.response?.data || error.message
    });
    
    throw error.response?.data || error;
  }
};

// Auth service implementation
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await makeApiRequest('account_login', { email, password });
      console.log('Login response:', response);
      
      if (response.success && response.value) {
        localStorage.setItem('token', response.value);
        return {
          success: true,
          value: {
            token: response.value,
            user: {
              email,
            },
          },
        };
      }
      throw new Error('Invalid login response');
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (data: { name: string; email: string; password: string }) => {
    try {
      const response = await makeApiRequest('account_create', data);
      console.log('Register response:', response);
      
      if (response.success && response.value) {
        localStorage.setItem('token', response.value);
        return {
          success: true,
          value: {
            token: response.value,
            user: {
              name: data.name,
              email: data.email,
            },
          },
        };
      }
      throw new Error('Invalid registration response');
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    }
  },
  
  getProfile: async () => {
    const response = await makeApiRequest('account');
    return response;
  },
  
  logout: async () => {
    await makeApiRequest('account_logout');
    localStorage.removeItem('token');
  },
  
  updateProfile: async (data: any) => {
    const response = await makeApiRequest('account_update', data);
    return response;
  },
  
  resetPassword: async (email: string) => {
    return makeApiRequest('account_reset', { email });
  },
  
  verifyAccount: async (token: string) => {
    return makeApiRequest('account_verify', { token });
  },
  
  updatePassword: async (data: { currentPassword: string; newPassword: string }) => {
    return makeApiRequest('account_password', {
      current_password: data.currentPassword,
      new_password: data.newPassword
    });
  },
};

// Numbers service implementation
export const numbersService = {
  create: async (data: { name: string; phone: string; webhook: string, type: string }) => {
    return makeApiRequest('numbers_insert', data);
  },

  read: async (id: string) => {
    return makeApiRequest('numbers_read', { id });
  },

  list: async () => {
    return makeApiRequest('numbers_list');
  },

  remove: async (id: string) => {
    return makeApiRequest('numbers_remove', { id });
  },

  logout: async (id: string) => {
    return makeApiRequest('numbers_logout', { id });
  },

  stop: async (id: string) => {
    return makeApiRequest('numbers_stop', { id });
  }
};

export default api;