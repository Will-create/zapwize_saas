// Mock data store for billing
export interface CreditBalance {
    amount: number;
    currency: string;
}

export interface AddCreditsResponse {
    success: boolean;
    newBalance: CreditBalance;
}

let creditBalance: CreditBalance = {
    amount: 50.00,
    currency: 'USD',
};

export const billingService = {
    getBalance: async (): Promise<CreditBalance> => {
        return new Promise(resolve => setTimeout(() => resolve(creditBalance), 300));
    },
    addCredits: async (amount: number): Promise<AddCreditsResponse> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (amount <= 0) {
                    return reject(new Error('Invalid credit amount'));
                }
                creditBalance.amount += amount;
                resolve({
                    success: true,
                    newBalance: creditBalance,
                });
            }, 700);
        });
    },
};
