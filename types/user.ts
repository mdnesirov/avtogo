import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type UserRole = 'owner' | 'renter'
