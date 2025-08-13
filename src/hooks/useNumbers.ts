import { useState, useEffect } from 'react';
import { numbersService } from '../services/api';

// Types
type NumberStatus = 'connected' | 'pending' | 'disconnected' | 'paused' | 'connecting' | 'error';

export type WhatsAppNumber = {
  id: string;
  name: string;
  phonenumber: string;
  webhook: string;
  baseurl: string;
  status: NumberStatus;
  createdAt: string;
  value?: string; // For QR code or pairing code
};

type AddNumberData = {
  name: string;
  phonenumber: string;
  webhook: string;
  type: 'code' | 'qrcode';
};

export const useNumbers = () => {
  const [numbers, setNumbers] = useState<WhatsAppNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load numbers on mount
  useEffect(() => {
    fetchNumbers();
  }, []);

  const fetchNumbers = async () => {
    setIsLoading(true);
    try {
      const response = await numbersService.list();
      const mappedNumbers = response.map((number: any) => ({
        ...number,
        status: mapStatusFromApi(number.status),
      }));
      setNumbers(mappedNumbers);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the status mapping function
  const mapStatusFromApi = (apiStatus: string): NumberStatus => {
    // Convert to lowercase for case-insensitive comparison
    const status = apiStatus?.toLowerCase();
    
    // Map database status values to frontend status values
    switch (status) {
      case 'active':
      case 'connected':
        return 'connected';
      case 'inactive':
      case 'disconnected':
        return 'disconnected';
      case 'paused':
        return 'paused';
      case 'connecting':
        return 'connecting';
      case 'error':
        return 'error';
      default:
        console.warn(`Unknown status from API: ${apiStatus}`);
        return 'disconnected'; // Default fallback
    }
  };

  // Add a new number
  const addNumber = async (data: AddNumberData) => {
    try {
      setError(null);
      const response = await numbersService.create({
        name: data.name,
        phone: data.phonenumber,
        webhook: data.webhook,
        type: data.type
      });
      
      if (response.success) {
        const newNumber = { ...response.value, phonenumber: data.phonenumber, type: data.type };
        setNumbers([...numbers, newNumber]);
        return newNumber;
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error adding number:', error);
      throw new Error(error.message || 'Failed to add WhatsApp number');
    }
  };

  // Update a number's status (e.g., after reconnection)
  const reconnectNumber = async (phone: string) => {
    try {
      setError(null);
      const numberToUpdate = numbers.find(n => n.phonenumber === phone);
      if (!numberToUpdate) throw new Error('Number not found');
      
      const response = await numbersService.read(numberToUpdate.id);
      if (response.success) {
        setNumbers(numbers.map(number => 
          number.id === numberToUpdate.id ? response.value : number
        ));
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error reconnecting number:', error);
      throw new Error(error.message || 'Failed to reconnect WhatsApp number');
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
    } catch (err) {
      const error = err as Error;
      console.error('Error removing number:', error);
      throw new Error(error.message || 'Failed to remove WhatsApp number');
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
    } catch (err) {
      const error = err as Error;
      console.error('Error logging out number:', error);
      throw new Error(error.message || 'Failed to logout WhatsApp number');
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
    } catch (err) {
      const error = err as Error;
      console.error('Error stopping number:', error);
      throw new Error(error.message || 'Failed to stop WhatsApp number');
    }
  };

  // Pause a number
  const pauseNumber = async (id: string) => {
    try {
      setError(null);
      const response = await numbersService.pause(id);
      if (response.success) {
        setNumbers(numbers.map(number => 
          number.id === id 
            ? { ...number, status: 'disconnected' as NumberStatus } 
            : number
        ));
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error pausing number:', error);
      throw new Error(error.message || 'Failed to pause WhatsApp number');
    }
  };

  // Resume a number
  const resumeNumber = async (id: string) => {
    try {
      setError(null);
      const response = await numbersService.resume(id);
      if (response.success) {
        setNumbers(numbers.map(number => 
          number.id === id 
            ? { ...number, status: 'connected' as NumberStatus } 
            : number
        ));
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error resuming number:', error);
      throw new Error(error.message || 'Failed to resume WhatsApp number');
    }
  };

  // Get a number's status
  const statusNumber = async (id: string) => {
    try {
      setError(null);
      const response = await numbersService.status(id);
      if (response.success) {
        setNumbers(numbers.map(number => 
          number.id === id 
            ? { ...number, status: response.value.status as NumberStatus } 
            : number
        ));
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error getting number status:', error);
      throw new Error(error.message || 'Failed to get WhatsApp number status');
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
    pauseNumber,
    resumeNumber,
    statusNumber,
  };
};