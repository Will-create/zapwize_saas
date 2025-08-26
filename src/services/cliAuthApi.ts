import api  from './api';

export const cliAuthApi = {
  verify: async (state: string, timestamp: string) => {
    try {
      // In a real application, you would make a POST request to your backend
      // to verify the state and timestamp and get an auth token in return.
      const response = await api.post('/cli-auth/verify', { state, timestamp });
      return response.data;
    } catch (error) {
      // Handle error appropriately
      console.error('CLI Auth API verification failed:', error);
      throw error;
    }
  },
};
