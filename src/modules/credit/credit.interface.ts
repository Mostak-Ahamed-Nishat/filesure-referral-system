export type TCreateCreditTransaction = {
  userId: string;
  amount: number;
  type: 'earned' | 'used';
  description: string;
  relatedReferralId?: string;
  relatedPurchaseId?: string;
};
