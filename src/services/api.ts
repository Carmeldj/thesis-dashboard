import axios from "axios";
import type { User, Shop, LoginCredentials, AuthResponse } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  loginAdmin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post(
      `${API_BASE_URL}/auth/admin/login`,
      credentials
    );
    return response.data;
  },
};

// Users API
export const usersAPI = {
  findAll: async (): Promise<User[]> => {
    const response = await api.get("/users");
    return response.data;
  },

  findAllStreamers: async (): Promise<User[]> => {
    const response = await api.get("/users/streamers/all");
    return response.data;
  },

  findOne: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Shops API
export const shopsAPI = {
  findAll: async (): Promise<Shop[]> => {
    const response = await api.get("/shops");
    return response.data;
  },

  findOne: async (id: string): Promise<Shop> => {
    const response = await api.get(`/shops/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<Shop>): Promise<Shop> => {
    const response = await api.patch(`/shops/${id}`, data);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/shops/${id}`);
  },
};

export default api;
