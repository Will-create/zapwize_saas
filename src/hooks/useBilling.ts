import { useState, useEffect } from 'react';
import { useNumbers } from './useNumbers';
import { billingService } from '../services/api';
import { handleApiError } from '../utils/errorHandler';

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  price2: number; // yearly price
  maxreq: number;
  limit: number | null;
  description: string | null;
}

export interface BillingHistoryItem {
  order_id: string;
  plan_name: string;
  number_name: string;
  phone_number: string;
  amount: number;
  paid_amount: number;
  status: 'paid' | 'pending' | 'failed';
  date: string;
  expire: string | null;
}

export interface OrderSummary {
  planName: string;
  originalPrice: number;
  discount: number;
  finalPrice: number;
  cycle: 'monthly' | 'yearly';
  couponValid: boolean;
  couponMessage: string | null;
}

export interface CouponValidation {
  valid: boolean;
  discountType: 'percentage' | 'fixed' | null;
  discountValue: number | null;
  message: string | null;
}

const defaultPlan: BillingPlan = {
  id: '',
  name: 'Free Plan',
  price: 0,
  price2: 0,
  maxreq: 100,
  limit: null,
  description: 'Basic free plan'
};

export const useBilling = () => {
  const [currentPlan, setCurrentPlan] = useState<BillingPlan>(defaultPlan);
  const [availablePlans, setAvailablePlans] = useState<BillingPlan[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [couponValidation, setCouponValidation] = useState<CouponValidation | null>(null);
  const [processingCoupon, setProcessingCoupon] = useState(false);
  const [processingSummary, setProcessingSummary] = useState(false);
  const { numbers } = useNumbers();
  
  const fetchBillingData = async (numberid?: string) => {
    setLoading(true);
    setError(null);
    try {
      const [currentPlanData, availablePlansData, billingHistoryData] = await Promise.all([
        numberid ? billingService.getCurrentPlan(numberid) : Promise.resolve(null),
        billingService.getAvailablePlans(),
        numberid ? billingService.getBillingHistory(numberid) : Promise.resolve([])
      ]);

      if (currentPlanData) {
        setCurrentPlan(currentPlanData);
      } else {
        setCurrentPlan(defaultPlan);
      }
      
      if (availablePlansData) {
        setAvailablePlans(availablePlansData);
      } else {
        setAvailablePlans([]);
      }
      
      if (billingHistoryData) {
        setBillingHistory(billingHistoryData);
      } else {
        setBillingHistory([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const validateCoupon = async (code: string, planId: string, numberId: string) => {
    setProcessingCoupon(true);
    try {
      const response = await billingService.validateCoupon(code, planId, numberId);
      
      if (response.success) {
        setCouponValidation(response.value);
      } else {
        setCouponValidation({
          valid: false,
          discountType: null,
          discountValue: null,
          message: response.value?.message || null
        });
      }
    } catch (error) {
      setCouponValidation({
        valid: false,
        discountType: null,
        discountValue: null,
        message: 'Error validating coupon'
      });
      handleApiError(error);
    } finally {
      setProcessingCoupon(false);
    }
  };

  const getOrderSummary = async (
    planId: string, 
    numberId: string, 
    cycle: 'monthly' | 'yearly', 
    couponCode?: string
  ) => {
    setProcessingSummary(true);
    try {
      const response = await billingService.getOrderSummary(planId, numberId, cycle, couponCode);
      
      console.log('Order summary API response:', response);
      
      let summaryData = null;
      
      // Handle different response formats
      if (response && typeof response === 'object') {
        // If it's a direct object with the expected properties
        if ('originalPrice' in response && 'finalPrice' in response) {
          summaryData = response;
        } 
        // If it's wrapped in a success/value structure
        else if (response.success && response.value) {
          summaryData = response.value;
        }
        // If it's an array (as mentioned in your code)
        else if (Array.isArray(response) && response.length > 0) {
          summaryData = response[0];
        }
        // If it has couponValid property
        else if ('couponValid' in response) {
          summaryData = response;
        }
      
        // Set the order summary if we found valid data
        if (summaryData) {
          // Ensure all required fields are present
          const normalizedSummary: OrderSummary = {
            planName: summaryData.planName || '',
            originalPrice: summaryData.originalPrice || 0,
            discount: summaryData.discount || 0,
            finalPrice: summaryData.finalPrice || summaryData.originalPrice || 0,
            cycle: summaryData.cycle || cycle,
            couponValid: summaryData.couponValid !== undefined ? summaryData.couponValid : false,
            couponMessage: summaryData.couponMessage || null
          };
          
          setOrderSummary(normalizedSummary);
          
          // Synchronize coupon validation with order summary if a coupon code was provided
          if (couponCode && normalizedSummary.couponValid !== undefined) {
            // Update coupon validation based on order summary
            setCouponValidation({
              valid: normalizedSummary.couponValid,
              discountType: normalizedSummary.discount > 0 ? 'fixed' : null,
              discountValue: normalizedSummary.discount > 0 ? normalizedSummary.discount : null,
              message: normalizedSummary.couponMessage || 
                      (normalizedSummary.couponValid ? 'Coupon applied successfully' : null)
            });
          }
          
          return normalizedSummary;
        }
      }
      
      // If we reach here, we couldn't parse the response in any expected format
      console.warn('Unexpected order summary format:', response);
      setOrderSummary(null);
      return null;
    } catch (error) {
      console.error('Error getting order summary:', error);
      setOrderSummary(null);
      return null;
    } finally {
      setProcessingSummary(false);
    }
  };

  const initiatePlanUpgrade = async (planId: string, numberId: string, cycle: 'monthly' | 'yearly', couponCode?: string) => {
    try {
      const response = await billingService.initiatePlanUpgradeWithCoupon(planId, numberId, cycle, couponCode);
      if (response) {
        return response;
      } else {
        setError(new Error(response.value?.message || 'Failed to initiate plan upgrade'));
      }
    } catch (error) {
      setError(new Error('An error occurred during plan upgrade'));
      handleApiError(error);
    }
  };

  useEffect(() => {
    if (numbers.length > 0) {
      fetchBillingData(numbers[0].id);
    } else {
      fetchBillingData();
    }
  }, [numbers]);

  const updateCouponValidation = (validation: CouponValidation) => {
    setCouponValidation(validation);
  };

  return {
    currentPlan,
    availablePlans,
    billingHistory,
    loading,
    error,
    orderSummary,
    couponValidation,
    processingCoupon,
    processingSummary,
    linkedNumbers: numbers.map(number => ({
      id: number.id,
      name: number.name,
      phoneNumber: number.phonenumber,
    })),
    initiatePlanUpgrade,
    validateCoupon,
    getOrderSummary,
    refetchBillingData: fetchBillingData,
    updateCouponValidation
  };
};