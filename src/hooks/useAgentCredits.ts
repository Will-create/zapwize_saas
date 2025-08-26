import { useState, useEffect, useCallback } from 'react';
import {
    getCreditBalance as apiGetCreditBalance,
    addCredits as apiAddCredits,
    CreditBalance,
} from '../services/billingApi';
import { useAlertStore } from '../store/alertStore';

export const useAgentCredits = () => {
    const [balance, setBalance] = useState<CreditBalance | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { show: showAlert } = useAlertStore();

    const fetchBalance = useCallback(async () => {
        try {
            setIsLoading(true);
            const currentBalance = await apiGetCreditBalance();
            setBalance(currentBalance);
        } catch (error) {
            console.error('Failed to fetch credit balance', error);
            showAlert('Failed to fetch credit balance', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showAlert]);

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    const addCredits = async (amount: number) => {
        try {
            const response = await apiAddCredits(amount);
            setBalance(response.newBalance);
            showAlert(`${amount} credits added successfully!`, 'success');
            return response;
        } catch (error) {
            console.error('Failed to add credits', error);
            const message = error instanceof Error ? error.message : 'An unknown error occurred';
            showAlert(`Failed to add credits: ${message}`, 'error');
            throw error;
        }
    };

    return { balance, isLoading, addCredits, refetch: fetchBalance };
};
