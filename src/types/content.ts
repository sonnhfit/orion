export interface ContentItem {
  id: string;
  title: string;
  description: string;
  content: string;
  contentType: 'text' | 'image' | 'video' | 'carousel';
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'scheduled' | 'published';
  imageUrl?: string;
  videoUrl?: string;
  scheduledAt?: string;
  brandId: string;
  likes?: number;
  comments?: number;
  shares?: number;
  contentMetadata?: Record<string, any>;
  approvalStatus?: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  isApproved?: boolean;
  approvedAt?: string;
  approvedBy?: string;
  isPublished?: boolean;
  isActive?: boolean;
  tags?: string;
  hashtags?: string;
  slug?: string;
}

export interface SocialMediaChannel {
  id: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'linkedin' | 'twitter';
  name: string;
  icon: string;
  enabled: boolean;
  autoPost: boolean;
  connectedAt?: string;
  followers?: number;
}

export interface ContentSchedule {
  id: string;
  channelId: string;
  contentId: string;
  scheduledTime: string;
  timezone: string;
  autoRepeatDays?: number;
}

export interface ContentConfig {
  id: string;
  brandId: string;
  channels: SocialMediaChannel[];
  postsPerWeek: number;
  preferredTimes: string[];
  autoPostEnabled: boolean;
  contentCategories: string[];
  language: string;
}
