import { useState, useEffect } from 'react';

// Types
type ApiKey = {
  id: string;
  name: string;
  key: string;
  linkedNumber: string;
  permissions: string[];
  createdAt: string;
};

type CreateApiKeyData = {
  name: string;
  numberId: string;
  permissions: string[];
};

// Mock data
const mockApiKeys: ApiKey[] = [
  {
    id: 'key_1',
    name: 'Marketing Bot',
    key: 'ZPW_71e0cc18b06ab9fd7e6b',
    linkedNumber: 'Customer Support',
    permissions: ['send_messages', 'receive_messages'],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'key_2',
    name: 'Shopify Integration',
    key: 'ZPW_1f8b97c4a5e062d439f8',
    linkedNumber: 'Sales Team',
    permissions: ['send_messages', 'receive_messages', 'media_access', 'webhook_events'],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Generate a random API key
const generateApiKey = () => {
  const prefix = 'ZPW_';
  const characters = 'abcdef0123456789';
  let result = '';
  
  for (let i = 0; i < 20; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return prefix + result;
};

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  
  // Load mock data on mount
  useEffect(() => {
    // In a real app, this would be an API call
    const storedKeys = localStorage.getItem('zapwize_api_keys');
    setApiKeys(storedKeys ? JSON.parse(storedKeys) : mockApiKeys);
  }, []);

  // Save to localStorage whenever apiKeys change
  useEffect(() => {
    localStorage.setItem('zapwize_api_keys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  // Create a new API key
  const createApiKey = (data: CreateApiKeyData): Promise<ApiKey> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Get the linked number name instead of ID
        const numbersData = localStorage.getItem('zapwize_numbers');
        const numbers = numbersData ? JSON.parse(numbersData) : [];
        
        const linkedNumber = numbers.find((n: any) => n.id === data.numberId);
        
        if (!linkedNumber) {
          return reject(new Error('The selected WhatsApp number could not be found.'));
        }

        const newKey: ApiKey = {
          id: `key_${Math.random().toString(36).substr(2, 9)}`,
          name: data.name,
          key: generateApiKey(),
          linkedNumber: linkedNumber.name,
          permissions: data.permissions,
          createdAt: new Date().toISOString(),
        };
        
        setApiKeys(prevKeys => [...prevKeys, newKey]);
        resolve(newKey);
      }, 1000); // Simulate network delay
    });
  };

  // Revoke an API key
  const revokeApiKey = (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setApiKeys(prevKeys => prevKeys.filter(key => key.id !== id));
        resolve();
      }, 500); // Simulate network delay
    });
  };

  return {
    apiKeys,
    createApiKey,
    revokeApiKey,
  };
};