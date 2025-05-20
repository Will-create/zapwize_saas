import { useState, useEffect } from 'react';
import { numbersService } from '../services/api';

// Types
type NumberStatus = 'connected' | 'pending' | 'disconnected';

type WhatsAppNumber = {
  id: string;
  name: string;
  phonenumber: string;
  webhook: string;
  url: string;
  baseurl: string;
  token: string;
  xtoken: string;
  status: NumberStatus;
  createdAt: string;
};

type AddNumberData = {
  id: string;
  name: string;
  phonenumber: string;
  webhook: string;
};

export const useNumbers = () => {
  const [numbers, setNumbers] = useState<WhatsAppNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load numbers on mount
  useEffect(() => {
    loadNumbers();
  }, []);

  const loadNumbers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await numbersService.list();
      if (response) {
        setNumbers(response);
      }
    } catch (err: any) {
      console.error('Error loading numbers:', err);
      setError(Array.isArray(err) ? err[0].error : 'Failed to load WhatsApp numbers');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new number
  const addNumber = async (data: AddNumberData) => {
    try {
      setError(null);
      const response = await numbersService.create({
        name: data.name,
        phoneNumber: data.phoneNumber,
        webhookUrl: data.webhookUrl
      });
      
      if (response.success) {
        setNumbers([...numbers, response.value]);
        return response.value;
      }
    } catch (err: any) {
      console.error('Error adding number:', err);
      throw Array.isArray(err) ? err[0].error : 'Failed to add WhatsApp number';
    }
  };

  // Update a number's status (e.g., after reconnection)
  const reconnectNumber = async (id: string) => {
    try {
      setError(null);
      const response = await numbersService.read(id);
      if (response.success) {
        setNumbers(numbers.map(number => 
          number.id === id ? response.value : number
        ));
      }
    } catch (err: any) {
      console.error('Error reconnecting number:', err);
      throw Array.isArray(err) ? err[0].error : 'Failed to reconnect WhatsApp number';
    }
  };

  // Remove a number
  const removeNumber = async (id: string) => {
    try {
      setError(null);
      const response = await numbersService.remove(id);
      if (response.success) {
        setNumbers(numbers.filter(number => number.id !== id));
      }
    } catch (err: any) {
      console.error('Error removing number:', err);
      throw Array.isArray(err) ? err[0].error : 'Failed to remove WhatsApp number';
    }
  };

  // Logout a number
  const logoutNumber = async (id: string) => {
    try {
      setError(null);
      const response = await numbersService.logout(id);
      if (response.success) {
        setNumbers(numbers.map(number => 
          number.id === id 
            ? { ...number, status: 'disconnected' as NumberStatus } 
            : number
        ));
      }
    } catch (err: any) {
      console.error('Error logging out number:', err);
      throw Array.isArray(err) ? err[0].error : 'Failed to logout WhatsApp number';
    }
  };

  // Stop a number
  const stopNumber = async (id: string) => {
    try {
      setError(null);
      const response = await numbersService.stop(id);
      if (response.success) {
        setNumbers(numbers.map(number => 
          number.id === id 
            ? { ...number, status: 'disconnected' as NumberStatus } 
            : number
        ));
      }
    } catch (err: any) {
      console.error('Error stopping number:', err);
      throw Array.isArray(err) ? err[0].error : 'Failed to stop WhatsApp number';
    }
  };

  return {
    numbers,
    isLoading,
    error,
    addNumber,
    reconnectNumber,
    removeNumber,
    logoutNumber,
    stopNumber,
  };
};