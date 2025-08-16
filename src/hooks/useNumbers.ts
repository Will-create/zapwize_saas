import { useState, useEffect } from 'react';
import { numbersService } from '../services/api';
import { useTranslation } from 'react-i18next';


// Types
type NumberStatus = 'connected' | 'pending' | 'disconnected' | 'paused' | 'connecting' | 'error';

export type WhatsAppNumber = {
  id: string;
  name: string;
  phonenumber: string;
  webhook: string;
  baseurl: string;
  token: string;
  userid: string;
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
  const { t } = useTranslation();
  
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
        console.warn(`${t('numbers.unknownStatusFromApi')}: ${apiStatus}`);
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
      
      if (response) {
        const newNumber = { ...response, phonenumber: data.phonenumber, type: data.type };
        return newNumber;
      }
    } catch (err) {
      const error = err as Error;
      console.error(`${t('numbers.errorAddingNumber')}:`, error);
      throw new Error(error.message || t('numbers.failedToAddWhatsappNumber'));
    }
  };

  // Update a number's status (e.g., after reconnection)
  const reconnectNumber = async (phone: string) => {
    try {
      setError(null);
      const numberToUpdate = numbers.find(n => n.phonenumber === phone);
      if (!numberToUpdate) throw new Error(t('numbers.numberNotFound'));
      
      const response = await numbersService.read(numberToUpdate.id);
      if (response.success) {
        setNumbers(numbers.map(number => 
          number.id === numberToUpdate.id ? response.value : number
        ));
      }
    } catch (err) {
      const error = err as Error;
      console.error(`${t('numbers.errorReconnectingNumber')}:`, error);
      throw new Error(error.message || t('numbers.failedToReconnectWhatsappNumber'));
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
      console.error(`${t('numbers.errorRemovingNumber')}:`, error);
      throw new Error(error.message || t('numbers.failedToRemoveWhatsappNumber'));
    }
  };

  const pairringNumber = async (phone: string) => {
    try {
      setError(null);
      const response = await numbersService.pairring(phone);
      return response;
    } catch (err) {
      const error = err as Error;
      console.error(`${t('numbers.errorPairingNumber')}:`, error);
      throw new Error(error.message || t('numbers.failedToPairWhatsappNumber'));
    }
  };

  const qrNumber = async (phone: string) => {
    try {
      setError(null);
      const response = await numbersService.qr(phone);
      return response;
    } catch (err) {
      const error = err as Error;
      console.error(`${t('numbers.errorQrNumber')}:`, error);
      throw new Error(error.message || t('numbers.failedToGenerateQrCode'));
    }
  };

  const stateNumber = async (phone: string) => {
    try {
      setError(null);
      const response = await numbersService.state(phone);
      return response;
    } catch (err) {
      const error = err as Error;
      console.error(`${t('numbers.errorStateNumber')}:`, error);
      throw new Error(error.message || t('numbers.failedToGetNumberState'));
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
      console.error(`${t('numbers.errorLoggingOutNumber')}:`, error);
      throw new Error(error.message || t('numbers.failedToLogoutWhatsappNumber'));
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
      console.error(`${t('numbers.errorStoppingNumber')}:`, error);
      throw new Error(error.message || t('numbers.failedToStopWhatsappNumber'));
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
      console.error(`${t('numbers.errorPausingNumber')}:`, error);
      throw new Error(error.message || t('numbers.failedToPauseWhatsappNumber'));
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
      console.error(`${t('numbers.errorResumingNumber')}:`, error);
      throw new Error(error.message || t('numbers.failedToResumeWhatsappNumber'));
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
      console.error(`${t('numbers.errorGettingNumberStatus')}:`, error);
      throw new Error(error.message || t('numbers.failedToGetWhatsappNumberStatus'));
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
    stateNumber,
    pairringNumber,
    qrNumber,
  };
};