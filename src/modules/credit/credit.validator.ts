import { z } from 'zod';

export const CreditValidation = {
  create: z.object({
    userId: z.string().min(1),
    amount: z.number().positive(),
    type: z.enum(['earned', 'used']),
    description: z.string().min(3),
    relatedReferralId: z.string().optional(),
    relatedPurchaseId: z.string().optional(),
  }),
};
