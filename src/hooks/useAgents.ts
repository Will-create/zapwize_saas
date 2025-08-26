import { useState, useEffect, useCallback } from 'react';
import {
  getAgents as apiGetAgents,
  createAgent as apiCreateAgent,
  updateAgent as apiUpdateAgent,
  toggleAgentStatus as apiToggleAgentStatus,
  deleteAgent as apiDeleteAgent,
  Agent,
} from '../services/agentsApi';
import { getTabData as apiGetTabData, updateTabData as apiUpdateTabData } from '../services/tabsApi';
import { useAlertStore } from '../store/alertStore';

export type { Agent };

export const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { show: showAlert } = useAlertStore();

  const fetchAgents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiGetAgents();
      setAgents(response);
    } catch (error) {
      console.error('Failed to fetch agents', error);
      showAlert('Failed to fetch agents', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const createAgent = async (data: { name: string; type: string; avatar?: string }) => {
    try {
      const response = await apiCreateAgent(data);
      setAgents([...agents, response.value]);
      showAlert('Agent created successfully', 'success');
    } catch (error) {
      console.error('Failed to create agent', error);
      showAlert('Failed to create agent', 'error');
      throw error;
    }
  };

  const updateAgent = async (id: string, data: Partial<Agent>) => {
    try {
      const response = await apiUpdateAgent(id, data);
      setAgents(agents.map(agent => (agent.id === id ? response : agent)));
      showAlert('Agent updated successfully', 'success');
      return response;
    } catch (error) {
      console.error('Failed to update agent', error);
      showAlert('Failed to update agent', 'error');
      throw error;
    }
  };

  const toggleAgentStatus = async (id: string) => {
    try {
      const response = await apiToggleAgentStatus(id);
      setAgents(agents.map(agent => (agent.id === id ? response : agent)));
      showAlert('Agent status updated', 'success');
    } catch (error) {
      console.error('Failed to toggle agent status', error);
      showAlert('Failed to toggle agent status', 'error');
      throw error;
    }
  };

  const deleteAgent = async (id: string) => {
    try {
      await apiDeleteAgent(id);
      setAgents(agents.filter(agent => agent.id !== id));
      showAlert('Agent deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete agent', error);
      showAlert('Failed to delete agent', 'error');
      throw error;
    }
  };

  const getTabData = async (agentId: string, tab: string) => {
    try {
      return await apiGetTabData(agentId, tab);
    } catch (error) {
      console.error(`Failed to fetch data for tab ${tab}`, error);
      showAlert(`Failed to fetch data for tab ${tab}`, 'error');
      throw error;
    }
  };

  const updateTabData = async (agentId: string, tab: string, data: any) => {
    try {
      const response = await apiUpdateTabData(agentId, tab, data);
      showAlert(`Tab ${tab} data updated successfully`, 'success');
      return response;
    } catch (error) {
      console.error(`Failed to update data for tab ${tab}`, error);
      showAlert(`Failed to update data for tab ${tab}`, 'error');
      throw error;
    }
  };

  return { agents, isLoading, createAgent, updateAgent, toggleAgentStatus, deleteAgent, getTabData, updateTabData };
};
