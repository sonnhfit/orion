import axios, { type AxiosInstance } from 'axios';
import type { LoginCredentials, LoginResponse, RegisterData, User } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://orionai.runagent.io';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add interceptor to include token in requests
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/api/v1/token/refresh/`, {
                refresh: refreshToken,
              });

              const { access } = response.data;
              localStorage.setItem('access_token', access);

              originalRequest.headers.Authorization = `Bearer ${access}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>('/api/v1/users/login/', credentials);
    return response.data;
  }

  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>('/api/v1/users/register', data);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get<User>('/api/v1/users/me');
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/api/v1/users/logout');
  }

  async loginWithGoogle(accessToken: string): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>('/api/v1/users/login/google', {
      access_token: accessToken,
    });
    return response.data;
  }

  async loginWithApple(identityToken: string): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>('/api/v1/users/login/apple', {
      identity_token: identityToken,
    });
    return response.data;
  }
}

export const apiService = new ApiService();
