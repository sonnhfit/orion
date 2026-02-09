import axios, { type AxiosInstance } from 'axios';
import type { ContentItem } from '../types/content';
import { API_BASE_URL } from './api';

export interface ContentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ContentItem[];
}

export interface ContentType {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentAsset {
  id: number;
  content: number;
  asset_type: 'image' | 'video' | 'audio' | 'document' | 'infographic' | 'other';
  file_url: string;
  thumbnail_url: string | null;
  file_size: number | null;
  description: string | null;
  alt_text: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ContentApprovalLog {
  id: number;
  approver: number | null;
  approver_username: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  notes: string | null;
  created_at: string;
}

export interface ContentSubmission {
  id: number;
  content: number;
  social_account: number;
  platform_name: string;
  status: 'pending' | 'submitted' | 'failed' | 'deleted';
  platform_post_id: string | null;
  platform_url: string | null;
  error_message: string | null;
  submitted_at: string | null;
  scheduled_for: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentSchedule {
  id: number;
  content: number;
  social_account: number;
  social_account_detail: any;
  platform_name: string;
  scheduled_for: string;
  is_posted: boolean;
  posted_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentSettings {
  id: number;
  brand: number;
  require_approval: boolean;
  auto_schedule: boolean;
  default_schedule_days: number | null;
  max_content_length: number | null;
  enable_hashtags: boolean;
  enable_mentions: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateContentData {
  brand: number;
  content_type: number;
  title: string;
  description?: string;
  body?: string;
  slug?: string;
  tags?: string;
  hashtags?: string;
  content_metadata?: Record<string, any>;
  is_active?: boolean;
}

export interface UpdateContentData {
  title?: string;
  description?: string;
  body?: string;
  slug?: string;
  tags?: string;
  hashtags?: string;
  content_metadata?: Record<string, any>;
  is_active?: boolean;
}

export interface ApprovalActionData {
  notes?: string;
}

export interface SubmitContentData {
  social_account_ids: number[];
}

class ContentApiService {
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

  // Content Type endpoints
  async getContentTypes(): Promise<ContentType[]> {
    const response = await this.api.get<ContentType[]>('/api/v1/content/content-types/');
    return response.data;
  }

  async getContentType(id: number): Promise<ContentType> {
    const response = await this.api.get<ContentType>(`/api/v1/content/content-types/${id}/`);
    return response.data;
  }

  // Content endpoints
  async getContents(params?: {
    brand?: number;
    content_type?: number;
    approval_status?: string;
    is_approved?: boolean;
    is_published?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<ContentListResponse> {
    const response = await this.api.get<ContentListResponse>('/api/v1/content/', { params });
    return response.data;
  }

  async getContent(id: number): Promise<ContentItem> {
    const response = await this.api.get<ContentItem>(`/api/v1/content/${id}/`);
    return response.data;
  }

  async createContent(data: CreateContentData): Promise<ContentItem> {
    const response = await this.api.post<ContentItem>('/api/v1/content/', data);
    return response.data;
  }

  async updateContent(id: number, data: UpdateContentData): Promise<ContentItem> {
    const response = await this.api.put<ContentItem>(`/api/v1/content/${id}/`, data);
    return response.data;
  }

  async patchContent(id: number, data: UpdateContentData): Promise<ContentItem> {
    const response = await this.api.patch<ContentItem>(`/api/v1/content/${id}/`, data);
    return response.data;
  }

  async deleteContent(id: number): Promise<void> {
    await this.api.delete(`/api/v1/content/${id}/`);
  }

  // Approval workflow endpoints
  async approveContent(id: number, data?: ApprovalActionData): Promise<{ status: string; content: ContentItem }> {
    const response = await this.api.post<{ status: string; content: ContentItem }>(
      `/api/v1/content/${id}/approve/`,
      data
    );
    return response.data;
  }

  async rejectContent(id: number, data?: ApprovalActionData): Promise<{ status: string; content: ContentItem }> {
    const response = await this.api.post<{ status: string; content: ContentItem }>(
      `/api/v1/content/${id}/reject/`,
      data
    );
    return response.data;
  }

  async requestChanges(id: number, data?: ApprovalActionData): Promise<{ status: string; content: ContentItem }> {
    const response = await this.api.post<{ status: string; content: ContentItem }>(
      `/api/v1/content/${id}/request_changes/`,
      data
    );
    return response.data;
  }

  async submitContent(id: number, data: SubmitContentData): Promise<{ status: string; submissions: ContentSubmission[] }> {
    const response = await this.api.post<{ status: string; submissions: ContentSubmission[] }>(
      `/api/v1/content/${id}/submit/`,
      data
    );
    return response.data;
  }

  // Special content endpoints
  async getPendingApproval(): Promise<ContentListResponse> {
    const response = await this.api.get<ContentListResponse>('/api/v1/content/pending_approval/');
    return response.data;
  }

  async getApprovedContent(): Promise<ContentListResponse> {
    const response = await this.api.get<ContentListResponse>('/api/v1/content/approved_content/');
    return response.data;
  }

  async getScheduledForToday(): Promise<ContentSchedule[]> {
    const response = await this.api.get<ContentSchedule[]>('/api/v1/content/scheduled_for_today/');
    return response.data;
  }

  // Content detail endpoints
  async getApprovalHistory(id: number): Promise<ContentApprovalLog[]> {
    const response = await this.api.get<ContentApprovalLog[]>(`/api/v1/content/${id}/approval_history/`);
    return response.data;
  }

  async getSubmissionStatus(id: number): Promise<ContentSubmission[]> {
    const response = await this.api.get<ContentSubmission[]>(`/api/v1/content/${id}/submission_status/`);
    return response.data;
  }

  async getScheduledPosts(id: number): Promise<ContentSchedule[]> {
    const response = await this.api.get<ContentSchedule[]>(`/api/v1/content/${id}/scheduled_posts/`);
    return response.data;
  }

  // Content Asset endpoints
  async getContentAssets(contentId?: number): Promise<ContentAsset[]> {
    const params: any = {};
    if (contentId) {
      params.content = contentId;
    }
    const response = await this.api.get<ContentAsset[]>('/api/v1/content/assets/', { params });
    return response.data;
  }

  async getContentAsset(id: number): Promise<ContentAsset> {
    const response = await this.api.get<ContentAsset>(`/api/v1/content/assets/${id}/`);
    return response.data;
  }

  async createContentAsset(data: Partial<ContentAsset>): Promise<ContentAsset> {
    const response = await this.api.post<ContentAsset>('/api/v1/content/assets/', data);
    return response.data;
  }

  async updateContentAsset(id: number, data: Partial<ContentAsset>): Promise<ContentAsset> {
    const response = await this.api.put<ContentAsset>(`/api/v1/content/assets/${id}/`, data);
    return response.data;
  }

  async deleteContentAsset(id: number): Promise<void> {
    await this.api.delete(`/api/v1/content/assets/${id}/`);
  }

  // Content Settings endpoints
  async getContentSettings(brandId?: number): Promise<ContentSettings[]> {
    const params: any = {};
    if (brandId) {
      params.brand = brandId;
    }
    const response = await this.api.get<ContentSettings[]>('/api/v1/content/settings/', { params });
    return response.data;
  }

  async getContentSetting(id: number): Promise<ContentSettings> {
    const response = await this.api.get<ContentSettings>(`/api/v1/content/settings/${id}/`);
    return response.data;
  }

  async createContentSetting(data: Partial<ContentSettings>): Promise<ContentSettings> {
    const response = await this.api.post<ContentSettings>('/api/v1/content/settings/', data);
    return response.data;
  }

  async updateContentSetting(id: number, data: Partial<ContentSettings>): Promise<ContentSettings> {
    const response = await this.api.put<ContentSettings>(`/api/v1/content/settings/${id}/`, data);
    return response.data;
  }

  async deleteContentSetting(id: number): Promise<void> {
    await this.api.delete(`/api/v1/content/settings/${id}/`);
  }

  // Special content generation endpoints
  async generateImageFromText(prompt: string, config?: Record<string, any>): Promise<{ status: string; image_url: string; metadata: Record<string, any> }> {
    const response = await this.api.post<{ status: string; image_url: string; metadata: Record<string, any> }>(
      '/api/v1/content/generate/image-from-text/',
      { prompt, config }
    );
    return response.data;
  }

  async createVideoFromImages(imageUrls: string[], config?: Record<string, any>): Promise<{ status: string; video_url: string; metadata: Record<string, any> }> {
    const response = await this.api.post<{ status: string; video_url: string; metadata: Record<string, any> }>(
      '/api/v1/content/generate/video-from-images/',
      { image_urls: imageUrls, config }
    );
    return response.data;
  }

  // Content metadata utilities
  createImageGenerationMetadata(prompt: string, style?: string, size?: string): Record<string, any> {
    return {
      type: 'image_generation',
      prompt,
      style: style || 'realistic',
      size: size || '1024x1024',
      generated_at: new Date().toISOString(),
      engine: 'dall-e-3',
      parameters: {
        quality: 'standard',
        style: style || 'natural',
      }
    };
  }

  createVideoCompositionMetadata(images: string[], duration: number, transition: string): Record<string, any> {
    return {
      type: 'video_composition',
      image_count: images.length,
      duration_per_image: duration,
      total_duration: duration * images.length,
      transition_effect: transition || 'fade',
      generated_at: new Date().toISOString(),
      engine: 'ffmpeg',
      parameters: {
        fps: 30,
        codec: 'h264',
        quality: 'high'
      }
    };
  }
}

export const contentApiService = new ContentApiService();