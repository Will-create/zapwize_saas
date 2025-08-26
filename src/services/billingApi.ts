import { billingService, CreditBalance, AddCreditsResponse } from './billingService';

export type { CreditBalance, AddCreditsResponse };

export const getCreditBalance = async (): Promise<CreditBalance> => {
    return await billingService.getBalance();
};

export const addCredits = async (amount: number): Promise<AddCreditsResponse> => {
    return await billingService.addCredits(amount);
};
