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
    // Backend: Return the current plan details
    // {
    //   success: boolean,
    //   value: {
    //     id: string,
    //     name: string,
    //     price: number,
    //     maxreq: number,
    //     limit: number | null,
    //     description: string | null
    //   }
    // }
    return makeApiRequest('billing_current_plan/' + numberid);
  },

  getAvailablePlans: async () => {
    // Backend: Return a list of available plans
    // {
    //   success: boolean,
    //   value: Array<{
    //     id: string,
    //     name: string,
    //     price: number,
    //     maxreq: number,
    //     limit: number | null,
    //     description: string | null
    //   }>
    // }
    return makeApiRequest('billing_plans');
  },

  initiatePlanUpgrade: async (planid: string, numberid: string, qty: number = 1) => {
    // Backend: Initiate the plan upgrade process and return LigdiCash redirect URL
    // {
    //   success: boolean,
    //   value: {
    //     redirectUrl: string
    //   }
    // }
    return makeApiRequest('billing_plans_upgrade/' + numberid, { planid, numberid, qty: 1 });
  },

  getBillingHistory: async (numberid: string) => {
    // Backend: Return the billing history
    // {
    //   success: boolean,
    //   value: Array<{
    //     id: string,
    //     date: string,
    //     amount: number,
    //     description: string,
    //     status: 'paid' | 'pending' | 'failed'
    //   }>
    // }
    return makeApiRequest('billing_history/' + numberid);
  },
};

export default api;