import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBilling } from '../hooks/useBilling';
import { CheckCircle, XCircle } from 'lucide-react';

const BillingPage: React.FC = () => {
  const {
    currentPlan,
    availablePlans,
    billingHistory,
    loading,
    error,
    initiatePlanUpgrade,
    refetchBillingData
  } = useBilling();

  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failure' | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (status === 'success' || status === 'failure') {
      setPaymentStatus(status);
      // Clear the query parameters
      navigate(location.pathname, { replace: true });
      // Refetch billing data to reflect any changes
      refetchBillingData();
    }
  }, [location, navigate, refetchBillingData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handlePlanUpgrade = async (planId: string) => {
    const redirectUrl = await initiatePlanUpgrade(planId);
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="text-center p-6">
        <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
        <h2 className="text-2xl font-bold mb-2">Payment Successful</h2>
        <p className="mb-4">Your plan has been successfully upgraded.</p>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => setPaymentStatus(null)}
        >
          Go to Billing Dashboard
        </button>
      </div>
    );
  }

  if (paymentStatus === 'failure') {
    return (
      <div className="text-center p-6">
        <XCircle className="mx-auto mb-4 text-red-500" size={48} />
        <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
        <p className="mb-4">There was an issue processing your payment. Please try again.</p>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => setPaymentStatus(null)}
        >
          Go to Billing Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Billing</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
        <p>Plan: {currentPlan?.name}</p>
        <p>Price: ${currentPlan?.price}</p>
        <p>Max Requests: {currentPlan?.maxreq}</p>
        <p>Limit: {currentPlan?.limit || 'Unlimited'}</p>
        <p>Description: {currentPlan?.description || 'N/A'}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        {availablePlans.map((plan: any) => (
          <div key={plan.id} className="mb-4 p-4 border rounded">
            <h3 className="font-semibold">{plan.name}</h3>
            <p>${plan.price}</p>
            <p>Max Requests: {plan.maxreq}</p>
            <p>Limit: {plan.limit || 'Unlimited'}</p>
            <p>Description: {plan.description || 'N/A'}</p>
            <button
              onClick={() => handlePlanUpgrade(plan.id)}
              disabled={plan.id === currentPlan?.id}
              className={`mt-2 px-4 py-2 rounded ${
                plan.id === currentPlan?.id
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {plan.id === currentPlan?.id ? 'Current Plan' : 'Upgrade to this Plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
              <th className="text-left p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {billingHistory.map((item: any) => (
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
                <td className="p-2">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingPage;