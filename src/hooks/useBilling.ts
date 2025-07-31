import { useState, useEffect } from 'react';
import { useNumbers } from './useNumbers';
import { billingService } from '../services/api';

// Types
type BillingPlan = {
  id: string;
  name: string;
  price: number;
  maxreq: number;
  limit?: number;
  description?: string;
};

type BillingHistoryItem = {
  order_id: string;
  plan_name: string;
  number_name: string;
  phone_number: string;
  amount: number;
  paid_amount: number;
  status: 'paid' | 'pending' | 'failed';
  date: string;
  expire?: string;
  description: string;
};

// Default plan
const defaultPlan: BillingPlan = {
  id: 'free',
  name: 'Free Plan',
  price: 0,
  maxreq: 100,
  description: 'Basic features for small projects'
};

export const useBilling = () => {
  const [currentPlan, setCurrentPlan] = useState<BillingPlan>(defaultPlan);
  const [availablePlans, setAvailablePlans] = useState<BillingPlan[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { numbers } = useNumbers();
  
  const fetchBillingData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [currentPlanData, availablePlansData, billingHistoryData] = await Promise.all([
        billingService.getCurrentPlan(),
        billingService.getAvailablePlans(),
        billingService.getBillingHistory()
      ]);

      setCurrentPlan(currentPlanData.value);
      setAvailablePlans(availablePlansData.value);
      setBillingHistory(billingHistoryData.value);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const initiatePlanUpgrade = async (planId: string) => {
    try {
      const response = await billingService.initiatePlanUpgrade(planId);
      return response.value.redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      return null;
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  return {
    currentPlan,
    availablePlans,
    billingHistory,
    loading,
    error,
    linkedNumbers: numbers.map(number => ({
      id: number.id,
      name: number.name,
      phoneNumber: number.phonenumber,
    })),
    initiatePlanUpgrade,
    refetchBillingData: fetchBillingData
  };
};