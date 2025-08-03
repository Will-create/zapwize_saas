import { useAlertStore } from '../store/alertStore';

/**
 * Extracts error message from various error response formats
 * @param error - The error object from API response
 * @returns Formatted error message string
 */
export const extractErrorMessage = (error: any): string => {
  // Case 1: Error is an array with objects
  if (Array.isArray(error)) {
    if (error.length > 0) {
      const firstError = error[0];
      return firstError.error || firstError.value || 'An error occurred';
    }
  }
  
  // Case 2: Error response data is an array
  if (error?.response?.data && Array.isArray(error.response.data)) {
    if (error.response.data.length > 0) {
      const firstError = error.response.data[0];
      return firstError.error || firstError.value || 'An error occurred';
    }
  }
  
  // Case 3: Error has a message property
  if (error?.message) {
    return error.message;
  }
  
  // Case 4: Error is a string
  if (typeof error === 'string') {
    return error;
  }
  
  // Default case
  return 'An unexpected error occurred';
};

/**
 * Global error handler that shows alerts for errors
 * @param error - The error object
 * @param customMessage - Optional custom message to display instead of the error message
 */
export const handleApiError = (error: any, customMessage?: string): void => {
  const { show } = useAlertStore.getState();
  const errorMessage = customMessage || extractErrorMessage(error);
  
  console.error('API Error:', error);
  show(errorMessage, 'error');
};