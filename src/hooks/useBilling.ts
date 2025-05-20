import { useState, useEffect } from 'react';
import { useNumbers } from './useNumbers';

// Types
type Invoice = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'paid' | 'failed';
};

type BillingPlan = {
  planId: 'free' | 'pro' | 'business';
  hasPaymentMethod: boolean;
};

// Mock invoices
const mockInvoices: Invoice[] = [
  {
    id: 'inv_1',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Pro Plan - Monthly',
    amount: 29.00,
    status: 'paid',
  },
  {
    id: 'inv_2',
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Pro Plan - Monthly',
    amount: 29.00,
    status: 'paid',
  },
];

// Default plan
const defaultPlan: BillingPlan = {
  planId: 'free',
  hasPaymentMethod: false,
};

export const useBilling = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentPlan, setCurrentPlan] = useState<BillingPlan>(defaultPlan);
  const { numbers } = useNumbers();
  
  // Load mock data on mount
  useEffect(() => {
    // In a real app, these would be API calls
    const storedInvoices = localStorage.getItem('zapwize_invoices');
    const storedPlan = localStorage.getItem('zapwize_current_plan');
    
    setInvoices(storedInvoices ? JSON.parse(storedInvoices) : mockInvoices);
    setCurrentPlan(storedPlan ? JSON.parse(storedPlan) : defaultPlan);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('zapwize_invoices', JSON.stringify(invoices));
    localStorage.setItem('zapwize_current_plan', JSON.stringify(currentPlan));
  }, [invoices, currentPlan]);

  // Update plan
  const updatePlan = (numberId: string, planId: string) => {
    // In a real app, this would make an API call to update the plan
    // and then reflect the changes in the UI
    
    setCurrentPlan({
      planId: planId as 'free' | 'pro' | 'business',
      hasPaymentMethod: planId === 'free' ? false : true,
    });
    
    // If upgrading from free, generate a new invoice
    if (planId !== 'free' && currentPlan.planId === 'free') {
      const amount = planId === 'pro' ? 29.00 : 99.00;
      
      const newInvoice: Invoice = {
        id: `inv_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan - Monthly`,
        amount,
        status: 'paid',
      };
      
      setInvoices([newInvoice, ...invoices]);
    }
  };

  return {
    invoices,
    currentPlan,
    linkedNumbers: numbers.map(number => ({
      id: number.id,
      name: number.name,
      phoneNumber: number.phoneNumber,
    })),
    updatePlan,
  };
};