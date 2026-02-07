import axios, { type AxiosInstance } from 'axios';
import type { LoginCredentials, LoginResponse, RegisterData, User } from '../types/auth';
import type { 
  Brand, 
  BrandListResponse, 
  CreateBrandData, 
  UpdateBrandData, 
  SocialPlatform,
  DataSource,
  CreateDataSourceData,
  UpdateDataSourceData,
  DataSourceListResponse 
} from '../types/brand';

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

  // Brand endpoints
  async getBrands(): Promise<BrandListResponse> {
    const response = await this.api.get<Brand[] | BrandListResponse>('/api/v1/brands/');
    // Handle both array response and paginated response
    if (Array.isArray(response.data)) {
      return {
        count: response.data.length,
        results: response.data,
      };
    }
    return response.data;
  }

  async getBrand(slug: string): Promise<Brand> {
    const response = await this.api.get<Brand>(`/api/v1/brands/${slug}/`);
    return response.data;
  }

  async createBrand(data: CreateBrandData): Promise<Brand> {
    const response = await this.api.post<Brand>('/api/v1/brands/', data);
    return response.data;
  }

  async updateBrand(slug: string, data: UpdateBrandData): Promise<Brand> {
    const response = await this.api.put<Brand>(`/api/v1/brands/${slug}/`, data);
    return response.data;
  }

  async deleteBrand(slug: string): Promise<void> {
    await this.api.delete(`/api/v1/brands/${slug}/`);
  }

  async activateBrand(slug: string): Promise<{ status: string }> {
    const response = await this.api.post<{ status: string }>(`/api/v1/brands/${slug}/activate/`);
    return response.data;
  }

  async deactivateBrand(slug: string): Promise<{ status: string }> {
    const response = await this.api.post<{ status: string }>(`/api/v1/brands/${slug}/deactivate/`);
    return response.data;
  }

  async getPlatforms(): Promise<SocialPlatform[]> {
    const response = await this.api.get<SocialPlatform[]>('/api/v1/brands/platforms/');
    return response.data;
  }

  // Data Source endpoints
  async getDataSources(brandId?: number): Promise<DataSourceListResponse> {
    const params: any = {};
    if (brandId) {
      params.brand = brandId;
    }
    const response = await this.api.get<DataSource[] | DataSourceListResponse>('/api/v1/brands/data-sources/', { params });
    
    // Handle both array response and paginated response
    if (Array.isArray(response.data)) {
      return {
        count: response.data.length,
        results: response.data,
      };
    }
    return response.data;
  }

  async getDataSource(id: number): Promise<DataSource> {
    const response = await this.api.get<DataSource>(`/api/v1/brands/data-sources/${id}/`);
    return response.data;
  }

  async createDataSource(data: CreateDataSourceData): Promise<DataSource> {
    const response = await this.api.post<DataSource>('/api/v1/brands/data-sources/', data);
    return response.data;
  }

  async updateDataSource(id: number, data: UpdateDataSourceData): Promise<DataSource> {
    const response = await this.api.put<DataSource>(`/api/v1/brands/data-sources/${id}/`, data);
    return response.data;
  }

  async patchDataSource(id: number, data: UpdateDataSourceData): Promise<DataSource> {
    const response = await this.api.patch<DataSource>(`/api/v1/brands/data-sources/${id}/`, data);
    return response.data;
  }

  async deleteDataSource(id: number): Promise<void> {
    await this.api.delete(`/api/v1/brands/data-sources/${id}/`);
  }

  async activateDataSource(id: number): Promise<{ status: string }> {
    const response = await this.api.post<{ status: string }>(`/api/v1/brands/data-sources/${id}/activate/`);
    return response.data;
  }

  async deactivateDataSource(id: number): Promise<{ status: string }> {
    const response = await this.api.post<{ status: string }>(`/api/v1/brands/data-sources/${id}/deactivate/`);
    return response.data;
  }

  async crawlDataSource(id: number): Promise<{ status: string }> {
    const response = await this.api.post<{ status: string }>(`/api/v1/brands/data-sources/${id}/crawl_now/`);
    return response.data;
  }
}

export const apiService = new ApiService();
