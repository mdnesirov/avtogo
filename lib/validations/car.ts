import { z } from 'zod'

export const carSchema = z.object({
  car_name:        z.string().min(2, 'Car name is required'),
  brand:           z.string().min(1, 'Brand is required'),
  model:           z.string().min(1, 'Model is required'),
  year:            z.number().int().min(1990).max(new Date().getFullYear() + 1),
  car_type:        z.string().optional(),
  transmission:    z.enum(['manual', 'automatic']),
  fuel_type:       z.enum(['petrol', 'diesel', 'electric', 'hybrid']),
  price_per_day:   z.number().positive('Price must be positive'),
  location:        z.string().min(2, 'Location is required'),
  city:            z.string().optional(),
  description:     z.string().optional(),
  airport_delivery:z.boolean().default(false),
  whatsapp_phone:  z.string().optional(),
})

export type CarFormData = z.infer<typeof carSchema>
