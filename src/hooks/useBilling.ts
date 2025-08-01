import { useState, useEffect } from 'react';
import { useNumbers } from './useNumbers';
import { billingService } from '../services/api';

// Types
export type BillingPlan = {
  id: string;
  name: string;
  price: number;
  maxreq: number;
  limit?: number;
  description?: string;
};

export type BillingHistoryItem = {
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
  
  const fetchBillingData = async (numberid?: string) => {
    setLoading(true);
    setError(null);
    try {
      const [currentPlanData, availablePlansData, billingHistoryData] = await Promise.all([
        numberid && billingService.getCurrentPlan(numberid),
        billingService.getAvailablePlans(),
        numberid && billingService.getBillingHistory(numberid)
      ]);

      setCurrentPlan(currentPlanData || defaultPlan);
      setAvailablePlans(availablePlansData);
      setBillingHistory(billingHistoryData || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const initiatePlanUpgrade = async (planId: string, numberId: string, qty: number) => {
  try {
    const response = await billingService.initiatePlanUpgrade(planId, numberId, qty);
    return response;
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