import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { extractErrorMessage } from '../utils/errorHandler';

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
      if (config.headers) {
        config.headers['x-token'] = token;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('Response error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API request wrapper following the backend pattern
export const makeApiRequest = async (schema: string, data?: unknown) => {
  try {
    const payload: { schema: string; data?: any } = { schema };

    if (data)
    payload.data = data;
    
    console.log('API Request:', { schema, data });
    const response = await api.post('/api/', payload);
    console.log('API Response:', response);
    
    return response.data;
  } catch (error: unknown) {
    console.error('API Error:', {
      schema,
      data,
      error: error instanceof AxiosError ? error.response?.data || error.message : error
    });
    const errorMessage = extractErrorMessage(error);
    
    // Throw a standardized error object
    throw { message: errorMessage, originalError: error };
  }
};

// Auth service implementation
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await makeApiRequest('account_login', { email, password });
      console.log('Login response:', response);
      
      // Handle array response format
      if (Array.isArray(response)) {
        const firstItem = response[0];
        
        // Check if login failed
        if (!firstItem.success) {
          throw firstItem;
        }
        
        // If successful, extract the token
        if (firstItem.token) {
          localStorage.setItem('token', firstItem.token);
          return [{
            success: true,
            token: firstItem.token,
            user: {
              email,
            },
          }];
        }
      }
      // Handle object response format
      else if (response.success && response.value) {
        localStorage.setItem('token', response.value);
        return {
          success: true,
          token: response.value,
          user: {
            email,
          },
        };
      }
      
      throw new Error('Invalid login response');
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
  
  updateProfile: async (data: unknown) => {
    const response = await makeApiRequest('account_update', data);
    return response;
  },
  
  resetPassword: async (email: string) => {
    return await makeApiRequest('account_reset', { email });
  },
  
  verifyAccount: async (token: string) => {
    return await makeApiRequest('account_verify', { token });
  },
  
  updatePassword: async (data: { currentPassword: string; newPassword: string }) => {
    return await makeApiRequest('account_password', {
      current_password: data.currentPassword,
      new_password: data.newPassword
    });
  },

  // 2FA services
  generateTwoFactorSecret: async () => {
    return await makeApiRequest('account_2fa_generate');
  },

  enableTwoFactorAuth: async (token: string) => {
    return await makeApiRequest('account_2fa_enable', { token });
  },

  disableTwoFactorAuth: async () => {
    return await makeApiRequest('account_2fa_disable');
  },

  verifyTwoFactorToken: async (token: string) => {
    return await makeApiRequest('account_2fa_verify', { token });
  },
};

// Numbers service implementation
export const numbersService = {
  create: async (data: { name: string; phone: string; webhook: string, type: string }) => {
    return await makeApiRequest('numbers_insert', data);
  },

  read: async (id: string) => {
    return await makeApiRequest('numbers_read/' + id);
  },

  list: async () => {
    return await makeApiRequest('numbers_list');
  },

  remove: async (id: string) => {
    return await makeApiRequest('numbers_remove/' + id);
  },

  logout: async (id: string) => {
    return await makeApiRequest('numbers_logout/' + id);
  },
  pause: async (id: string) => {
    return await makeApiRequest('numbers_pause/' + id);
  },

  resume: async (id: string) => {
    return await makeApiRequest('numbers_resume/' + id);
  },

  stop: async (id: string) => {
    return await makeApiRequest('numbers_pause/' + id);
  },
  qr: async (phone: string) => {
    return await makeApiRequest('instance_qr/' + phone);
  },
  pairring: async (phone: string) => {
    return await makeApiRequest('instance_pairring/' + phone);
  },
  state: async (phone: string) => {
    return await makeApiRequest('instance_state/' + phone);
  },
  status: async (id: string) => {
    return await makeApiRequest('numbers_status/' + id);
  }


};

// Fetch dashboard data for a specific number
// Expected response structure:
// {
//   "success": true,
//   "value": {
//     "calls": [
//       {
//         "id": "string",
//         "duration": "number",
//         "timestamp": "string"
//       }
//     ],
//     "messages": [
//       {
//         "id": "string",
//         "content": "string",
//         "timestamp": "string"
//       }
//     ],
//     "statistics": {
//       "totalCalls": "number",
//       "totalMessages": "number"
//     }
//   }
// }
export const fetchDashboardData = async (numberId: string) => {
  try {
    const response = await makeApiRequest('dashboard_data/' + numberId);
    return response;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const notificationsService = {
  fetchNotifications: async (filter: 'all' | 'unread' = 'all') => {
    try {
      const response = await makeApiRequest('notifications_list', { filter });
      console.log('Fetched notifications:', response);
      return response;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  markAsRead: async (id: string) => {
    try {
      const response = await makeApiRequest('notifications_mark_read', { id });
      return response.success;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await makeApiRequest('notifications_all_read');
      return response.success;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },
};

export const billingService = {
  getCurrentPlan: async (numberid: string) => {
    return await makeApiRequest('billing_current_plan/' + numberid);
  },

  getAvailablePlans: async () => {
    return await makeApiRequest('billing_plans');
  },

  initiatePlanUpgrade: async (planid: string, numberid: string, qty: number = 1) => {
    return await makeApiRequest('billing_plans_upgrade/' + numberid, { planid, numberid, qty: 1 });
  },

  getBillingHistory: async (numberid: string) => {
    return await makeApiRequest('billing_history/' + numberid);
  },

  validateCoupon: async (couponCode: string, planId: string, numberid: string) => {
    try {
      const response = await makeApiRequest('billing_validate_coupon', { 
        code: couponCode, 
        planid: planId, 
        numberid 
      });
      
      return response;
    } catch (error) {
      return {
        success: false,
        value: {
          valid: false,
          discountType: null,
          discountValue: null,
          message: extractErrorMessage(error)
        }
      };
    }
  },

  initiatePlanUpgradeWithCoupon: async (planId: string, numberid: string, cycle: 'monthly' | 'yearly', couponCode?: string) => {
    return await makeApiRequest('billing_plans_upgrade/' + numberid, { 
      planid: planId, 
      numberid, 
      cycle,
      coupon: couponCode || null 
    });
  },

  getOrderSummary: async (planId: string, numberId: string, cycle: 'monthly' | 'yearly', couponCode?: string) => {
    try {
      const response = await makeApiRequest('billing_order_summary', {
        planid: planId,
        numberid: numberId,
        cycle: cycle,
        coupon: couponCode || null
      });
      return response;
    } catch (error) {
    }
  }
};

export const APIKeysService = {
  create: async (data: { name: string; value: string; permissions: string[] }) => {
    return await makeApiRequest('apikeys_create', data);
  },

  read: async (id: string) => {
    return await makeApiRequest('apikeys_read/' + id);
  },

  list: async () => {
    return await makeApiRequest('apikeys');
  },

  remove: async (id: string) => {
    return await makeApiRequest('apikeys_remove/' + id);
  },

  update: async (id: string, data: unknown) => {
    return await makeApiRequest('apikeys_update/' + id, data);
  },

  generate: async (id: string) => {
    return await makeApiRequest('apikeys_generate/' + id);
  },

  reset: async (id: string) => {
    return await makeApiRequest('apikeys_reset/' + id);
  },
}

// services/api.js

export const cliAuthService = {
  // Check current user session
  getProfile: async () => {
    return await makeApiRequest('account'); // schema 'account' validates cookie
  },
  // Approve CLI login
  approve: async (state: string) => {
    return await makeApiRequest('cli_approve', { state });
  }
};

export default api;