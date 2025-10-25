import { z } from 'zod';

const registerValidation = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name is required'),
  referralCode: z.string().optional(),
});

const loginValidation = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const AuthValidation = {
  register: registerValidation,
  login: loginValidation,
};
