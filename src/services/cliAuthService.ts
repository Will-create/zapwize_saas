import { cliAuthApi } from './cliAuthApi';
import { agentsApi } from './agentsApi';

export const cliAuthService = {
  verify: async (state: string, timestamp: string): Promise<{ success: boolean }> => {
    try {
      await cliAuthApi.verify(state, timestamp);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  getProfile: async () => {
    try {
      // Assuming agentsApi.getProfile() fetches user profile
      const response = await agentsApi.getProfile();
      return { value: response };
    } catch (error) {
      return { value: null };
    }
  },

  approve: async (state: string) => {
    try {
      // Assuming cliAuthApi.approve(state) handles the approval logic
      const response = await cliAuthApi.approve(state);
      return response;
    } catch (error) {
      return { success: false, status: 'error' };
    }
  },
};
