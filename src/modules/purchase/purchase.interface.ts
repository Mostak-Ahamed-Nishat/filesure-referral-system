export type TCreatePurchase = {
  userId: string;
  status?: 'completed' | 'cancelled';
};
