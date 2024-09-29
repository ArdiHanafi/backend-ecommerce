import { z } from 'zod';

export const SignUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
})

export const AddressSchema = z.object({
  lineOne: z.string(),
  lineTwo: z.string().optional(),
  city: z.string(),
  country: z.string()
})

export const updateUserSchema = z.object({
  name: z.string().optional(),
  defaultShippingAddressId: z.string().optional(),
  defaultBillingAddressId: z.string().optional()
})