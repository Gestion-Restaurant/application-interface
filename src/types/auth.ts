export type UserRole = 'chef' | 'delivery' | 'client';
export enum UserRoleEnum {
  CHEF = 'chef',
  DELIVERY = 'delivery',
  CLIENT = 'client',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface LoginResponse {
  data: {
    user: User;
    token: string;
  },
  success: boolean;
}