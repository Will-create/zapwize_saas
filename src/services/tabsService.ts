// Mock data store for tabs
const tabsData = {
    overview: {
        name: 'Sales Bot',
        status: 'active' as 'active' | 'inactive' | 'draft',
        description: 'A friendly bot for sales inquiries.',
        avatar: 'https://i.pravatar.cc/150?img=3',
    },
    prompts: {
        systemPrompt: 'You are a helpful sales assistant.',
    },
    billing: {
        balance: 100,
        currency: 'USD',
        history: [],
    },
    settings: {
        provider: 'openai',
        model: 'gpt-4',
        tokenCap: 10000,
        webhookUrl: 'https://example.com/webhook',
    },
};

export const tabsService = {
    getTabData: async (agentId: string, tab: string): Promise<any> => {
        return new Promise(resolve => setTimeout(() => resolve((tabsData as any)[tab]), 300));
    },
    updateTabData: async (agentId: string, tab: string, data: any): Promise<any> => {
        return new Promise(resolve => {
            setTimeout(() => {
                (tabsData as any)[tab] = { ...(tabsData as any)[tab], ...data };
                resolve((tabsData as any)[tab]);
            }, 500);
        });
    },
};
