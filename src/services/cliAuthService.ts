import { cliAuthApi } from './cliAuthApi';

export const cliAuthService = {
  verify: async (state: string, timestamp: string): Promise<{ success: boolean }> => {
    try {
      // The API call will be mocked by MSW in a development environment.
      // In a production environment, this will hit the actual backend.
      await cliAuthApi.verify(state, timestamp);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
};
