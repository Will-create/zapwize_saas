import { makeApiRequest } from './api';

export const agentsService = {
    list: async () => {
        return makeApiRequest('agents_list');
    },
    create: async (data: { name: string, type: string }) => {
        return makeApiRequest('agents_create', data);
    },
    update: async (id: string, data: Partial<{ name: string, type: string, connectionId: string }>) => {
        return makeApiRequest(`agents_update/${id}`, data);
    },
    toggleStatus: async (id: string) => {
        return makeApiRequest(`agents_toggle_status/${id}`);
    },
    remove: async (id: string) => {
        return makeApiRequest(`agents_remove/${id}`);
    }
};
