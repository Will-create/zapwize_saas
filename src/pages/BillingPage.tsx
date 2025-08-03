import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBilling } from '../hooks/useBilling';
import { CheckCircle, XCircle } from 'lucide-react';
import { BillingPlan, BillingHistoryItem } from '../hooks/useBilling';
import OrderSummaryModal from '../components/billing/OrderSummaryModal';
import { useTranslation } from 'react-i18next';
import { handleApiError } from '../utils/errorHandler';
import { useAlertStore } from '../store/alertStore';

const BillingPage: React.FC = () => {
  const { t } = useTranslation();

  const {
    currentPlan,
    availablePlans,
    billingHistory,
    loading,
    error,
    initiatePlanUpgrade,
    refetchBillingData,
    linkedNumbers,
    validateCoupon,
    getOrderSummary,
    orderSummary,
    couponValidation,
    processingCoupon,
    processingSummary,
    updateCouponValidation // Add this
  } = useBilling();

  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failure' | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<string>('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  // Order summary modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<BillingPlan | null>(null);
  const [couponCode, setCouponCode] = useState('');

  // Add alert store
  const { show: showAlert } = useAlertStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (status === 'success' || status === 'failure') {
      setPaymentStatus(status);
      navigate(location.pathname, { replace: true });
      refetchBillingData(selectedNumber);
    }
  }, [location, navigate, refetchBillingData, selectedNumber]);

  useEffect(() => {
    if (linkedNumbers.length > 0 && !selectedNumber) {
      setSelectedNumber(linkedNumbers[0].id);
    }
  }, [linkedNumbers, selectedNumber]);

  // Reset coupon and order summary when plan or cycle changes
  useEffect(() => {
    setCouponCode('');
  }, [selectedPlan, billingCycle]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error.message}</div>;

  const refreshOrderSummary = async () => {
    if (selectedPlan && selectedNumber) {
      try {
        await getOrderSummary(selectedPlan.id, selectedNumber, billingCycle, couponCode || undefined);
      } catch (error) {
        console.error('Failed to refresh order summary:', error);
        // Show a more user-friendly error message
        showAlert(t('billing.unableToLoadSummary'), "error");
      }
    }
  };

  const handlePlanSelect = async (plan: BillingPlan) => {
    setSelectedPlan(plan);
    setIsOrderModalOpen(true);
    
    // Pre-fetch order summary for better UX
    if (selectedNumber) {
      try {
        await getOrderSummary(plan.id, selectedNumber, billingCycle);
      } catch (error) {
        console.error('Failed to get initial order summary:', error);
        // Don't show an alert here as the modal will handle this state
      }
    }
  };

  const handleCouponValidate = async (code: string) => {
    if (!selectedPlan || !selectedNumber) return;
    
    // If code is empty, just clear the coupon and refresh summary
    if (!code.trim()) {
      setCouponCode('');
      // Clear coupon validation
      updateCouponValidation({
        valid: false,
        discountType: null,
        discountValue: null,
        message: null
      });
      
      try {
        await getOrderSummary(selectedPlan.id, selectedNumber, billingCycle);
      } catch (error) {
        console.error('Failed to refresh order summary:', error);
      }
      return;
    }
    
    setCouponCode(code);
    try {
      // First validate the coupon
      await validateCoupon(code, selectedPlan.id, selectedNumber);
      
      // Then update order summary with coupon applied
      try {
        const summary = await getOrderSummary(selectedPlan.id, selectedNumber, billingCycle, code);
        
        // If summary was fetched successfully but coupon validation shows invalid,
        // update the coupon validation based on the summary
        if (summary && summary.couponValid && couponValidation && !couponValidation.valid) {
          updateCouponValidation({
            valid: true,
            discountType: summary.discount > 0 ? 'fixed' : null,
            discountValue: summary.discount > 0 ? summary.discount : null,
            message: summary.couponMessage || 'Coupon applied successfully'
          });
        }
      } catch (summaryError) {
        console.error('Failed to update order summary with coupon:', summaryError);
        showAlert(t('billing.couponFailedMessage'), "warning");
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      // The validateCoupon function handles errors internally
    }
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPlan || !selectedNumber) return;
    
    try {
      const response = await initiatePlanUpgrade(selectedPlan.id, selectedNumber, billingCycle, couponCode);
      if (response) {
        window.location.href = response;
      } else {
        showAlert("Failed to initiate plan upgrade. Please try again.", "error");
      }
    } catch (error) {
      handleApiError(error, "Failed to initiate plan upgrade. Please try again.");
    }
  };

  const renderPlanPrice = (plan: BillingPlan) => {
    const price = billingCycle === 'monthly' ? plan.price : plan.price2;
    const cycleText = billingCycle === 'monthly' ? '/month' : '/year';
    return `${price} ${cycleText}`;
  };

  if (paymentStatus) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          {paymentStatus === 'success' ? (
            <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
          ) : (
            <XCircle className="mx-auto mb-4 text-red-500" size={48} />
          )}
          <h2 className="text-2xl font-bold mb-2">
            {paymentStatus === 'success' ? t('billing.paymentSuccessful') : t('billing.paymentFailed')}
          </h2>
          <p className="mb-4">
            {paymentStatus === 'success'
              ? t('billing.successMessage')
              : t('billing.failureMessage')}
          </p>
          <button
            className={`px-4 py-2 text-white rounded ${
              paymentStatus === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'
            }`}
            onClick={() => setPaymentStatus(null)}
          >
            {t('billing.goToDashboard')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">{t('billing.account')}</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-green-600">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('billing.selectWhatsAppNumber')}</h2>
        <select
          value={selectedNumber}
          onChange={(e) => setSelectedNumber(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option value="">{t('billing.selectNumber')}</option>
          {linkedNumbers.map((number) => (
            <option key={number.id} value={number.id}>
              {number.name} ({number.phoneNumber})
            </option>
          ))}
        </select>
      </div>

      {selectedNumber && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-green-600">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('billing.currentPlan')}</h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-bold text-lg text-gray-800">{currentPlan.name}</p>
              <p className="text-gray-600">${currentPlan.price}/month</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-700">{t('billing.maxRequests')}: <span className="font-semibold">{currentPlan.maxreq.toLocaleString()}</span></p>
              <p className="text-gray-700">{t('billing.dailyLimit')}: <span className="font-semibold">{currentPlan.limit ? currentPlan.limit.toLocaleString() : t('billing.unlimited')}</span></p>
            </div>
          </div>
          <p className="mt-4 text-gray-700">{currentPlan.description || t('billing.noDescription')}</p>
        </div>
      )}

      {/* Billing Cycle Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 rounded-xl bg-gray-200 p-1">
          {['monthly', 'yearly'].map((cycle) => (
            <button
              key={cycle}
              className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                billingCycle === cycle
                  ? 'bg-white shadow text-green-600'
                  : 'text-gray-700 hover:bg-white/[0.12] hover:text-green-600'
              }`}
              onClick={() => setBillingCycle(cycle as 'monthly' | 'yearly')}
            >
              {t(`billing.${cycle}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-green-600">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('billing.availablePlans')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {availablePlans.map((plan: BillingPlan) => (
            <div key={plan.id} className={`border rounded-lg p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg ${plan.id === currentPlan.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-400'}`}>
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">{plan.name}</h3>
                <p className="text-2xl font-bold mb-2 text-green-600">{renderPlanPrice(plan)}</p>
                <div className="space-y-1 my-3">
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">{t('billing.maxRequests')}:</span> {plan.maxreq.toLocaleString()}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">{t('billing.dailyLimit')}:</span> {plan.limit ? plan.limit.toLocaleString() : t('billing.unlimited')}
                  </p>
                </div>
                <p className="mt-2 text-sm text-gray-500">{plan.description || t('billing.noDescription')}</p>
              </div>
              <button
                onClick={() => handlePlanSelect(plan)}
                disabled={!selectedNumber || plan.id === currentPlan.id}
                className={`mt-4 px-4 py-2 rounded-md w-full transition-colors duration-200 ${
                  !selectedNumber || plan.id === currentPlan.id
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {plan.id === currentPlan.id ? t('billing.currentPlanLabel') : t('billing.upgradeToPlan', { 0: billingCycle })}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto border-l-4 border-green-600">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('billing.billingHistory')}</h2>
        {billingHistory.length > 0 ? (
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2 text-gray-700">{t('billing.orderId')}</th>
                <th className="text-left p-2 text-gray-700">{t('billing.plan')}</th>
                <th className="text-left p-2 text-gray-700">{t('billing.number')}</th>
                <th className="text-left p-2 text-gray-700">{t('billing.amount')}</th>
                <th className="text-left p-2 text-gray-700">{t('billing.paidAmount')}</th>
                <th className="text-left p-2 text-gray-700">{t('billing.status')}</th>
                <th className="text-left p-2 text-gray-700">{t('billing.date')}</th>
                <th className="text-left p-2 text-gray-700">{t('billing.expiry')}</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((item: BillingHistoryItem) => (
                <tr key={item.order_id} className="border-b">
                  <td className="p-2">{item.order_id}</td>
                  <td className="p-2">{item.plan_name}</td>
                  <td className="p-2">{item.number_name} ({item.phone_number})</td>
                  <td className="p-2">{item.amount.toFixed(2)} FCFA</td>
                  <td className="p-2">{item.paid_amount.toFixed(2)} FCFA</td>
                  <td className="p-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : item.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {t(`billing.${item.status}`)}
                    </span>
                  </td>
                  <td className="p-2">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="p-2">{item.expire ? new Date(item.expire).toLocaleDateString() : t('billing.na')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center p-4">{t('billing.noHistory')}</p>
        )}
      </div>

      {isOrderModalOpen && selectedPlan && (
        <OrderSummaryModal
          refreshSummary={refreshOrderSummary}
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          onConfirm={handleConfirmUpgrade}
          planName={selectedPlan.name}
          planPrice={billingCycle === 'monthly' ? selectedPlan.price : selectedPlan.price2}
          planPrice2={selectedPlan.price2}
          cycle={billingCycle}  
          selectedNumberId={selectedNumber}
          linkedNumbers={linkedNumbers}
          onNumberChange={(numberId) => {
            setSelectedNumber(numberId);
            // Refresh order summary with new number
            if (selectedPlan) {
              getOrderSummary(selectedPlan.id, numberId, billingCycle, couponCode);
            }
          }}
          couponCode={couponCode}
          onCouponChange={(code) => setCouponCode(code)}
          validateCoupon={(code) => {
            if (selectedPlan && selectedNumber) {
              handleCouponValidate(code);
            }
          }}
          orderSummary={orderSummary}
          couponValidation={couponValidation}
          processingCoupon={processingCoupon}
          processingSummary={processingSummary}
          onCouponValidationChange={(validation) => {
            if (validation) {
              updateCouponValidation(validation);
              
              // Also refresh the order summary to ensure it's in sync
              if (selectedPlan && selectedNumber) {
                getOrderSummary(selectedPlan.id, selectedNumber, billingCycle, couponCode);
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default BillingPage;