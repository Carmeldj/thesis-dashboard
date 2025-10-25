export interface User {
  id: string;
  bio?: string;
  username?: string;
  firstname: string;
  lastname: string;
  email: string;
  image?: string;
  role?: string;
  is_verified: boolean;
  phoneNumber?: string;
  followers?: string[];
  following?: string[];
  isStreamer: boolean;
  createdAt: Date;
  updatedAt: Date;
  shop?: Shop;
}

export interface Shop {
  id: string;
  name?: string;
  address: string;
  phone: string;
  email: string;
  ifu: string;
  website?: string;
  isActive: boolean;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
