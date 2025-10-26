import { z } from 'zod';

export const DashboardValidation = {
  query: z.object({
    period: z.enum(['month', 'week']).optional(),
    range: z.coerce.number().optional(),
  }),
};
