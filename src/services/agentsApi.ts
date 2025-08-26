import { agentsService } from './agentsService';

export interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'draft';
  dtcreated: string;
  avatar?: string;
  connectionid?: string;
}

export const getAgents = async () => await agentsService.list();

export const createAgent = async (data: { name: string; type: string }) => await agentsService.create(data);

export const updateAgent = async (id: string, data: Partial<Agent>) => await agentsService.update(id, data);

export const toggleAgentStatus = async (id: string) => await agentsService.toggleStatus(id);

export const deleteAgent = async (id: string) => await agentsService.remove(id);
