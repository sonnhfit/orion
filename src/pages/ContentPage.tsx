import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { ContentConfig } from '../components/ContentConfig';
import { IoSettings, IoClose, IoHeart, IoHeartOutline, IoChatbubbleOutline, IoShareSocialOutline, IoCalendarOutline } from 'react-icons/io5';
import type { ContentItem, SocialMediaChannel } from '../types/content';
import '../styles/ContentPage.css';

export const ContentPage: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [likedContent, setLikedContent] = useState<Set<string>>(new Set());
  const [channels, setChannels] = useState<SocialMediaChannel[]>([
    {
      id: 'ch_1',
      platform: 'instagram',
      name: 'Instagram',
      icon: 'instagram',
      enabled: true,
      autoPost: true,
      followers: 1250,
      connectedAt: new Date().toISOString(),
    },
    {
      id: 'ch_2',
      platform: 'facebook',
      name: 'Facebook',
      icon: 'facebook',
      enabled: true,
      autoPost: false,
      followers: 3500,
      connectedAt: new Date().toISOString(),
    },
  ]);
  const [postsPerWeek, setPostsPerWeek] = useState(3);

  // Mock content data
  const mockContents: ContentItem[] = [
    {
      id: 'content_1',
      title: 'Bài viết về AI Marketing',
      description: 'Tìm hiểu cách AI giúp tự động hóa marketing',
      content: 'Trong thời đại số hóa, AI đang thay đổi cách chúng ta làm marketing. Từ việc phân tích dữ liệu khách hàng, tạo nội dung tự động, đến việc tối ưu hóa chiến dịch quảng cáo - AI đang mở ra những cơ hội mới cho các doanh nghiệp.',
      contentType: 'text',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'published',
      brandId: 'brand_1',
      likes: 45,
      comments: 8,
      shares: 12,
    },
    {
      id: 'content_2',
      title: 'Hình ảnh sản phẩm mới',
      description: 'Giới thiệu sản phẩm X version 2.0',
      content: 'Hình ảnh sản phẩm với thiết kế mới, tính năng được cải tiến vượt trội.',
      contentType: 'image',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
      status: 'published',
      imageUrl: 'https://via.placeholder.com/800x600?text=Product+Image',
      brandId: 'brand_1',
      likes: 120,
      comments: 15,
      shares: 34,
    },
    {
      id: 'content_3',
      title: 'Video tutorial tạo content',
      description: 'Hướng dẫn tạo content chuyên nghiệp',
      content: 'Video hướng dẫn chi tiết cách tạo content thu hút và chuyên nghiệp cho mạng xã hội.',
      contentType: 'video',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date(Date.now() - 259200000).toISOString(),
      status: 'scheduled',
      videoUrl: 'https://via.placeholder.com/800x450?text=Video+Thumbnail',
      brandId: 'brand_1',
      likes: 89,
      comments: 12,
      shares: 23,
    },
    {
      id: 'content_4',
      title: '5 tips marketing hiệu quả',
      description: '5 mẹo marketing giúp tăng doanh số',
      content: '1. Hiểu rõ khách hàng mục tiêu\n2. Tạo nội dung có giá trị\n3. Sử dụng data để tối ưu\n4. Đa dạng kênh tiếp cận\n5. Đo lường và cải thiện liên tục',
      contentType: 'carousel',
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      updatedAt: new Date(Date.now() - 345600000).toISOString(),
      status: 'draft',
      brandId: 'brand_1',
      likes: 0,
      comments: 0,
      shares: 0,
    },
    {
      id: 'content_5',
      title: 'Case study thành công',
      description: 'Câu chuyện thành công từ khách hàng',
      content: 'Chia sẻ từ CEO công ty X về cách họ tăng trưởng 300% doanh thu trong 6 tháng nhờ chiến lược marketing hiệu quả. Những bài học và kinh nghiệm quý báu cho các doanh nghiệp khác.',
      contentType: 'text',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      brandId: 'brand_1',
      likes: 0,
      comments: 0,
      shares: 0,
    },
  ];

  const handleUpdateChannels = (newChannels: SocialMediaChannel[]) => {
    setChannels(newChannels);
  };

  const handleUpdatePostsPerWeek = (count: number) => {
    setPostsPerWeek(count);
  };

  const handleSelectContent = (content: ContentItem) => {
    setSelectedContent(content);
  };

  const toggleLike = (contentId: string) => {
    setLikedContent((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(contentId)) {
        newSet.delete(contentId);
      } else {
        newSet.add(contentId);
      }
      return newSet;
    });
  };

  // Auto-select first content if none selected
  React.useEffect(() => {
    if (!selectedContent && mockContents.length > 0) {
      setSelectedContent(mockContents[0]);
    }
  }, []);

  return (
    <MainLayout>
      <div className="content-page-youtube">
        {/* YouTube-style Two Column Layout */}
        <div className="content-layout">
          {/* Left: Content Preview (Social Media Post Style) */}
          <div className="content-preview">
            {selectedContent ? (
              <div className="preview-container">
                {/* Settings Button - Top Right */}
                <button
                  className="settings-button"
                  onClick={() => setShowConfig(true)}
                  title="Cấu hình"
                >
                  <IoSettings />
                </button>

                {/* Social Media Post Header */}
                <div className="post-header">
                  <div className="post-author">
                    <div className="author-avatar">🏢</div>
                    <div className="author-info">
                      <h4>Thương hiệu của bạn</h4>
                      <span className="post-time">
                        {new Date(selectedContent.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                  <span className={`post-status ${selectedContent.status}`}>
                    {selectedContent.status === 'published' ? '✓ Đã đăng' : selectedContent.status === 'scheduled' ? '⏰ Đã lên lịch' : '📝 Nháp'}
                  </span>
                </div>

                {/* Post Content */}
                <div className="post-content">
                  <h2>{selectedContent.title}</h2>
                  <p className="post-text">{selectedContent.content}</p>
                </div>

                {/* Post Media */}
                {(selectedContent.imageUrl || selectedContent.videoUrl) && (
                  <div className="post-media">
                    <img
                      src={selectedContent.imageUrl || selectedContent.videoUrl || ''}
                      alt={selectedContent.title}
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="post-actions">
                  <button
                    className={`action-btn ${likedContent.has(selectedContent.id) ? 'active' : ''}`}
                    onClick={() => toggleLike(selectedContent.id)}
                  >
                    {likedContent.has(selectedContent.id) ? <IoHeart /> : <IoHeartOutline />}
                    <span>{(selectedContent.likes || 0) + (likedContent.has(selectedContent.id) ? 1 : 0)}</span>
                  </button>
                  <button className="action-btn">
                    <IoChatbubbleOutline />
                    <span>{selectedContent.comments}</span>
                  </button>
                  <button className="action-btn">
                    <IoShareSocialOutline />
                    <span>{selectedContent.shares}</span>
                  </button>
                </div>

                {/* Post Details */}
                <div className="post-details">
                  <div className="detail-row">
                    <span className="label">Loại nội dung:</span>
                    <span className="value">{selectedContent.contentType === 'text' ? 'Văn bản' : selectedContent.contentType === 'image' ? 'Hình ảnh' : selectedContent.contentType === 'video' ? 'Video' : 'Carousel'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Trạng thái:</span>
                    <span className={`value status-${selectedContent.status}`}>
                      {selectedContent.status === 'published' ? 'Đã đăng' : selectedContent.status === 'scheduled' ? 'Đã lên lịch' : 'Nháp'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Mô tả:</span>
                    <span className="value">{selectedContent.description}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="preview-empty">
                <p>Chọn một nội dung để xem preview</p>
              </div>
            )}
          </div>

          {/* Right: Content List */}
          <div className="content-list">
            {mockContents.map((content) => (
              <div
                key={content.id}
                className={`content-item ${selectedContent?.id === content.id ? 'active' : ''}`}
                onClick={() => handleSelectContent(content)}
              >
                <div className="content-thumbnail">
                  {content.imageUrl || content.videoUrl ? (
                    <img
                      src={content.imageUrl || content.videoUrl || ''}
                      alt={content.title}
                    />
                  ) : (
                    <div className="thumbnail-placeholder">
                      <span>{content.contentType === 'text' ? '📝' : content.contentType === 'video' ? '🎬' : '📄'}</span>
                    </div>
                  )}
                  <span className={`status-badge ${content.status}`}>
                    {content.status === 'published' ? 'Đã đăng' : content.status === 'scheduled' ? 'Đã lên lịch' : 'Nháp'}
                  </span>
                </div>
                <div className="content-info">
                  <h3>{content.title}</h3>
                  <p>{content.description}</p>
                  <div className="content-meta">
                    <span className="date">
                      <IoCalendarOutline /> {new Date(content.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="stats">
                      {content.likes} ❤️ · {content.comments} 💬
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Modal */}
        {showConfig && (
          <div className="config-modal-overlay" onClick={() => setShowConfig(false)}>
            <div className="config-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Cấu hình</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowConfig(false)}
                  title="Đóng"
                >
                  <IoClose />
                </button>
              </div>
              <div className="modal-body">
                <ContentConfig
                  channels={channels}
                  postsPerWeek={postsPerWeek}
                  onUpdateChannels={handleUpdateChannels}
                  onUpdatePostsPerWeek={handleUpdatePostsPerWeek}
                  isSaving={isSaving}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
