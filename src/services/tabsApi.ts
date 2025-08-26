import { tabsService } from './tabsService';

export const getTabData = async (agentId: string, tab: string) => {
    return await tabsService.getTabData(agentId, tab);
};

export const updateTabData = async (agentId: string, tab: string, data: any) => {
    return await tabsService.updateTabData(agentId, tab, data);
};
