import { useState } from 'react';
import { Download, CreditCard, CheckCircle } from 'lucide-react';
import { useBilling } from '../hooks/useBilling';
import PaymentMethodForm from '../components/billing/PaymentMethodForm';

const BillingPage = () => {
  const { invoices, currentPlan, linkedNumbers, updatePlan } = useBilling();
  const [selectedNumber, setSelectedNumber] = useState(
    linkedNumbers.length > 0 ? linkedNumbers[0].id : ''
  );
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: [
        '1,000 messages per month',
        'Basic WhatsApp features',
        'Email support',
        'Single number',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      features: [
        '10,000 messages per month',
        'Advanced WhatsApp features',
        'Priority support',
        'Up to 3 numbers',
        'Custom webhooks',
      ],
    },
    {
      id: 'business',
      name: 'Business',
      price: 99,
      features: [
        'Unlimited messages',
        'All WhatsApp features',
        '24/7 dedicated support',
        'Unlimited numbers',
        'Advanced analytics',
        'Custom integrations',
      ],
    },
  ];

  const handlePlanSelect = (planId: string) => {
    if (planId !== 'free' && !currentPlan.hasPaymentMethod) {
      // Show payment form if upgrading and no payment method exists
      setShowPaymentForm(true);
    } else {
      // Otherwise update the plan directly
      updatePlan(selectedNumber, planId);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    // In a real app, we would update the payment method status
    // and then process the plan change
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600 mt-1">Manage your subscription plans and payment methods</p>
      </div>

      {/* Number selection */}
      {linkedNumbers.length > 0 && (
        <div className="mb-6">
          <label htmlFor="numberSelect" className="block text-sm font-medium text-gray-700 mb-1">
            Select WhatsApp Number
          </label>
          <select
            id="numberSelect"
            value={selectedNumber}
            onChange={(e) => setSelectedNumber(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
          >
            {linkedNumbers.map((number) => (
              <option key={number.id} value={number.id}>
                {number.name} ({number.phoneNumber})
              </option>
            ))}
          </select>
        </div>
      )}

      {linkedNumbers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
              <CreditCard size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No WhatsApp numbers linked yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Please link a WhatsApp number first before managing billing and subscriptions.
            </p>
            <a href="/numbers" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Go to Numbers
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Plans */}
          <div className="mb-10">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Subscription Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isCurrentPlan = currentPlan.planId === plan.id;
                
                return (
                  <div 
                    key={plan.id}
                    className={`bg-white rounded-lg shadow overflow-hidden border-2 ${
                      isCurrentPlan ? 'border-green-500' : 'border-transparent'
                    }`}
                  >
                    {isCurrentPlan && (
                      <div className="bg-green-500 text-white text-center text-sm py-1">
                        Current Plan
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="text-3xl font-bold text-gray-900 mb-4">
                        ${plan.price}<span className="text-sm font-normal text-gray-500">/month</span>
                      </div>
                      <ul className="mb-8 space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle size={16} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handlePlanSelect(plan.id)}
                        disabled={isCurrentPlan}
                        className={`w-full py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                          isCurrentPlan
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
              {currentPlan.hasPaymentMethod && (
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Update
                </button>
              )}
            </div>
            
            {currentPlan.hasPaymentMethod ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded">
                    <CreditCard size={24} className="text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                    <p className="text-xs text-gray-500">Expires 12/2026</p>
                  </div>
                </div>
              </div>
            ) : showPaymentForm ? (
              <PaymentMethodForm 
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowPaymentForm(false)}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500 mb-4">No payment method on file</p>
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Add Payment Method
                </button>
              </div>
            )}
          </div>

          {/* Invoices */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Billing History</h2>
            {invoices.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">No billing history available</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Download
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(invoice.date).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{invoice.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${invoice.amount.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              invoice.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-green-600 hover:text-green-900 flex items-center justify-end">
                              <Download size={16} className="mr-1" />
                              PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BillingPage;