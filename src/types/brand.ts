/**
 * Brand Management Types
 */

export interface BrandSettings {
  id: number;
  brand: number;
  color_primary: string;
  color_secondary: string;
  brand_description: string;
  brand_voice: string;
  brand_values: string;
  content_language: string;
  posts_per_week: number;
  content_categories: string;
  auto_respond_enabled: boolean;
  auto_respond_message: string;
  lead_scoring_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialAccount {
  id: number;
  brand: number;
  platform: number;
  platform_name: string;
  platform_slug: string;
  account_name: string;
  account_id: string;
  followers_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  cover_image?: string;
  is_active: boolean;
  social_accounts_count: number;
  social_accounts?: SocialAccount[];
  settings?: BrandSettings;
  created_at: string;
  updated_at: string;
}

export interface CreateBrandData {
  name: string;
  slug: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateBrandData {
  name?: string;
  slug?: string;
  description?: string;
  is_active?: boolean;
}

export interface SocialPlatform {
  id: number;
  name: string;
  slug: string;
  icon: string;
  is_active: boolean;
}

export interface BrandListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Brand[];
}

/**
 * Data Source Types
 */
export interface DataSource {
  id: number;
  brand: number;
  brand_name: string;
  platform_type: string;
  platform_type_display: string;
  source_name: string;
  source_url?: string;
  crawl_frequency: string;
  crawl_frequency_display: string;
  is_active: boolean;
  last_crawled_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDataSourceData {
  brand: number;
  platform_type: string;
  source_name: string;
  source_url?: string;
  crawl_frequency?: string;
  is_active?: boolean;
  notes?: string;
}

export interface UpdateDataSourceData {
  brand?: number;
  platform_type?: string;
  source_name?: string;
  source_url?: string;
  crawl_frequency?: string;
  is_active?: boolean;
  notes?: string;
}

export interface DataSourceListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: DataSource[];
}
