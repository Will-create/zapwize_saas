import axios from 'axios';
import { handleApiError, extractErrorMessage } from '../utils/errorHandler';

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
    return makeApiRequest('numbers_read/' + id);
  },

  list: async () => {
    return makeApiRequest('numbers_list');
  },

  remove: async (id: string) => {
    return makeApiRequest('numbers_remove/' + id);
  },

  logout: async (id: string) => {
    return makeApiRequest('numbers_logout/' + id);
  },
  pause: async (id: string) => {
    return makeApiRequest('numbers_pause/' + id);
  },

  resume: async (id: string) => {
    return makeApiRequest('numbers_resume/' + id);
  },

  stop: async (id: string) => {
    return makeApiRequest('numbers_pause/' + id);
  },

  status: async (id: string) => {
    return makeApiRequest('numbers_status/' + id);
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
    return makeApiRequest('billing_current_plan/' + numberid);
  },

  getAvailablePlans: async () => {
    return makeApiRequest('billing_plans');
  },

  initiatePlanUpgrade: async (planid: string, numberid: string, qty: number = 1) => {
    return makeApiRequest('billing_plans_upgrade/' + numberid, { planid, numberid, qty: 1 });
  },

  getBillingHistory: async (numberid: string) => {
    return makeApiRequest('billing_history/' + numberid);
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
    return makeApiRequest('billing_plans_upgrade/' + numberid, { 
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

export default api;