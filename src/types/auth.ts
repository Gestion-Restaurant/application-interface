export type UserRole = 'restaurant_owner' | 'delivery_guy' | 'customer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}