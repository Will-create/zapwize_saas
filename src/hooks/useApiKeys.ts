import { useState, useEffect } from 'react';
import { APIKeysService, numbersService } from '../services/api';
// iport nubers

// Types
type ApiKey = {
  id?: string;
  name: string;
  value: string;
  numberid: string;
  permissions: string[];
  dtcreated?: string;
};

type CreateApiKeyData = {
  name: string;
  numberId: string;
  permissions: string[];
};


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
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  
  // Load mock data on mount
  useEffect(() => {
    fetchapikeys();
   
  }, []);

  const fetchapikeys = async () => {
    setIsLoading(true);
    try {
      const response = await APIKeysService.list();
      setApiKeys(response);
    } catch (error) {
      // Handle error appropriately
      console.error(error);
    } 
  };



  // Create a new API key
  const createApiKey = (data: CreateApiKeyData): Promise<ApiKey> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        // Get the linked number name instead of ID
        const linkedNumber = await numbersService.read(data.numberId);
        
        if (!linkedNumber) {
          return reject(new Error('The selected WhatsApp number could not be found.'));
        }

        const newKey: ApiKey = {
          name: data.name,
          value: generateApiKey(),
          numberid: linkedNumber.id,
          permissions: data.permissions
        };

        // create the API key in the backend
        try {
          setIsLoading(true);
          const response = await APIKeysService.create(newKey);
          resolve(response);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          return reject(error);
        }

     
        setApiKeys(prevKeys => [...prevKeys, newKey]);
        resolve(newKey);
      }, 1000); // Simulate network delay
    });
  };

  // Revoke an API key
  const revokeApiKey = (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        // Remove the API key from the backend
        try {
          setIsLoading(true);
          const response = await APIKeysService.remove(id);
          resolve(response);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          // Handle error appropriately
          console.error(error);
        }
        // Remove the API key from the local state
      }, 500); // Simulate network delay
    });
  };

  return {
    apiKeys,
    createApiKey,
    revokeApiKey,
  };
};