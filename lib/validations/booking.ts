import { z } from 'zod'

export const bookingSchema = z.object({
  start_date:       z.string().min(1, 'Start date required'),
  end_date:         z.string().min(1, 'End date required'),
  driver_name:      z.string().min(2, 'Full name required'),
  driver_phone:     z.string().min(7, 'Phone number required'),
  driver_email:     z.string().email('Valid email required'),
  driver_license:   z.string().optional(),
  airport_delivery: z.boolean().default(false),
}).refine(data => new Date(data.end_date) > new Date(data.start_date), {
  message: 'End date must be after start date',
  path: ['end_date'],
})

export type BookingFormData = z.infer<typeof bookingSchema>
