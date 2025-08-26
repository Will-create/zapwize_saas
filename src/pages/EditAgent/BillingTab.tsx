import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAgentCredits } from '@/hooks/useAgentCredits';
import Button from '@/components/ui/Button';
import { CreditCard, DollarSign, Loader2 } from 'lucide-react';

const creditOptions = [10, 25, 50, 100, 250, 500, 1000, 5000, 10000];

const BillingTab = () => {
    const { t } = useTranslation();
    const { balance, isLoading: isBalanceLoading, addCredits } = useAgentCredits();
    const [selectedAmount, setSelectedAmount] = useState(50);
    const [customAmount, setCustomAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddCredits = async () => {
        const amountToAdd = customAmount ? parseFloat(customAmount) : selectedAmount;
        if (isNaN(amountToAdd) || amountToAdd < 10) {
            alert('Please enter an amount of $10 or more.');
            return;
        }

        setIsSubmitting(true);
        try {
            await addCredits(amountToAdd);
            setCustomAmount('');
        } catch (error) {
            // error is handled in the hook
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium">{t('agents.edit.billing.title')}</h3>
                <p className="text-sm text-gray-500">{t('agents.edit.billing.description')}</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
                <h4 className="text-base font-semibold mb-4">{t('agents.edit.billing.currentBalance')}</h4>
                <div className="flex items-center">
                    {isBalanceLoading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    ) : (
                        <p className="text-4xl font-bold text-gray-800">
                            {balance?.amount.toFixed(2)} <span className="text-2xl text-gray-500">{balance?.currency}</span>
                        </p>
                    )}
                </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
                <h4 className="text-base font-semibold">{t('agents.edit.billing.addCredits')}</h4>
                <p className="text-sm text-gray-500 mb-6">{t('agents.edit.billing.selectAmount')}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
                    {creditOptions.map(amount => (
                        <button
                            key={amount}
                            onClick={() => {
                                setSelectedAmount(amount);
                                setCustomAmount('');
                            }}
                            className={`p-4 rounded-lg border-2 text-center font-semibold transition-colors ${
                                selectedAmount === amount && !customAmount
                                    ? 'bg-green-100 border-green-500 text-green-700'
                                    : 'bg-gray-50 border-gray-200 hover:border-green-400'
                            }`}
                        >
                            ${amount}
                        </button>
                    ))}
                </div>

                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="number"
                        placeholder={t('agents.edit.billing.customAmount')}
                        value={customAmount}
                        onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount(0);
                        }}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        min="10"
                    />
                </div>

                <div className="mt-6 flex justify-end">
                    <Button onClick={handleAddCredits} isLoading={isSubmitting}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        {t('agents.edit.billing.addCreditsButton', { amount: customAmount || selectedAmount })}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BillingTab;