import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBilling } from '../hooks/useBilling';
import { CheckCircle, XCircle } from 'lucide-react';
import { BillingPlan, BillingHistoryItem } from '../hooks/useBilling';

const BillingPage: React.FC = () => {
  const {
    currentPlan,
    availablePlans,
    billingHistory,
    loading,
    error,
    initiatePlanUpgrade,
    refetchBillingData,
    linkedNumbers
  } = useBilling();

  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failure' | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<string>('');
  const [selectedMonths, setSelectedMonths] = useState<number>(1);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (status === 'success' || status === 'failure') {
      setPaymentStatus(status);
      navigate(location.pathname, { replace: true });
      refetchBillingData();
    }
  }, [location, navigate, refetchBillingData]);

  useEffect(() => {
    if (linkedNumbers.length > 0 && !selectedNumber) {
      setSelectedNumber(linkedNumbers[0].id);
    }
  }, [linkedNumbers, selectedNumber]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error.message}</div>;

  const handlePlanUpgrade = async (planId: string) => {
    if (!selectedNumber) {
      alert("Please select a WhatsApp number first.");
      return;
    }
    const response = await initiatePlanUpgrade(planId, selectedNumber, selectedMonths);
    if (response && response.redirectUrl) {
      window.location.href = response.redirectUrl;
    } else {
      alert("Failed to initiate plan upgrade. Please try again.");
    }
  };

  const durationOptions = [
    { value: 1, label: '1 month' },
    { value: 3, label: '3 months' },
    { value: 6, label: '6 months' },
    { value: 12, label: '12 months' },
  ];

  if (paymentStatus) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          {paymentStatus === 'success' ? (
            <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
          ) : (
            <XCircle className="mx-auto mb-4 text-red-500" size={48} />
          )}
          <h2 className="text-2xl font-bold mb-2">
            {paymentStatus === 'success' ? 'Payment Successful' : 'Payment Failed'}
          </h2>
          <p className="mb-4">
            {paymentStatus === 'success'
              ? 'Your plan has been successfully upgraded.'
              : 'There was an issue processing your payment. Please try again.'}
          </p>
          <button
            className={`px-4 py-2 text-white rounded ${
              paymentStatus === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
            }`}
            onClick={() => setPaymentStatus(null)}
          >
            Go to Billing Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Billing</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Select WhatsApp Number</h2>
        <select
          value={selectedNumber}
          onChange={(e) => setSelectedNumber(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a number</option>
          {linkedNumbers.map((number) => (
            <option key={number.id} value={number.id}>
              {number.name} ({number.phoneNumber})
            </option>
          ))}
        </select>
      </div>

      {selectedNumber && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-bold text-lg">{currentPlan.name}</p>
              <p className="text-gray-600">${currentPlan.price}/month</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p>Max Requests: {currentPlan.maxreq}</p>
              <p>Limit: {currentPlan.limit || 'Unlimited'}</p>
            </div>
          </div>
          <p className="mt-4 text-gray-700">{currentPlan.description || 'No description available.'}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <div className="mb-6">
          <div className="flex space-x-1 rounded-xl bg-gray-200 p-1">
            {durationOptions.map((option) => (
              <button
                key={option.value}
                className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  selectedMonths === option.value
                    ? 'bg-white shadow text-blue-700'
                    : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-700'
                }`}
                onClick={() => setSelectedMonths(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availablePlans.map((plan: BillingPlan) => (
            <div key={plan.id} className="border rounded-lg p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
                <p className="text-2xl font-bold mb-2">${plan.price} <span className="text-sm font-normal">/month</span></p>
                <p className="text-gray-600 mb-2">Total: ${(plan.price * selectedMonths).toFixed(2)} for {selectedMonths} month{selectedMonths > 1 ? 's' : ''}</p>
                <p>Max Requests: {plan.maxreq}</p>
                <p>Limit: {plan.limit || 'Unlimited'}</p>
                <p className="mt-2 text-sm text-gray-500">{plan.description || 'No description available.'}</p>
              </div>
              <button
                onClick={() => handlePlanUpgrade(plan.id)}
                disabled={!selectedNumber || plan.id === currentPlan.id}
                className={`mt-4 px-4 py-2 rounded-md w-full ${
                  !selectedNumber || plan.id === currentPlan.id
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {plan.id === currentPlan.id ? 'Current Plan' : `Upgrade for ${selectedMonths} month${selectedMonths > 1 ? 's' : ''}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Billing History</h2>
        <table className="w-full min-w-max">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2">Order ID</th>
              <th className="text-left p-2">Plan</th>
              <th className="text-left p-2">Number</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Paid Amount</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Expiry</th>
            </tr>
          </thead>
          <tbody>
            {billingHistory.map((item: BillingHistoryItem) => (
              <tr key={item.order_id} className="border-b">
                <td className="p-2">{item.order_id}</td>
                <td className="p-2">{item.plan_name}</td>
                <td className="p-2">{item.number_name} ({item.phone_number})</td>
                <td className="p-2">${item.amount.toFixed(2)}</td>
                <td className="p-2">${item.paid_amount.toFixed(2)}</td>
                <td className="p-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : item.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
                <td className="p-2">{new Date(item.date).toLocaleDateString()}</td>
                <td className="p-2">{item.expire ? new Date(item.expire).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingPage;