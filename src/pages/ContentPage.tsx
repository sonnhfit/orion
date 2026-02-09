import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { ContentConfig } from '../components/ContentConfig';
import { IoClose, IoHeart, IoHeartOutline, IoChatbubbleOutline, IoShareSocialOutline, IoCalendarOutline, IoRefresh, IoAlertCircle } from 'react-icons/io5';
import type { ContentItem, SocialMediaChannel } from '../types/content';
import { contentApiService } from '../services/contentApi';
import '../styles/ContentPage.css';

export const ContentPage: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
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
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [showApprovalNotes, setShowApprovalNotes] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [currentAction, setCurrentAction] = useState<'approve' | 'reject' | 'request_changes' | null>(null);

  // Fetch content from API
  const fetchContents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contentApiService.getContents({
        approval_status: 'pending',
        ordering: '-created_at'
      });
      setContents(response.results);
      
      // Auto-select first content if none selected
      if (!selectedContent && response.results.length > 0) {
        setSelectedContent(response.results[0]);
      }
    } catch (err) {
      setError('Không thể tải danh sách nội dung. Vui lòng thử lại.');
      console.error('Error fetching contents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle approval workflow
  const handleApprovalAction = async (action: 'approve' | 'reject' | 'request_changes') => {
    if (!selectedContent) return;
    
    setCurrentAction(action);
    setShowApprovalNotes(true);
  };

  const submitApprovalAction = async () => {
    if (!selectedContent || !currentAction) return;

    try {
      if (currentAction === 'approve') {
        setApproving(true);
        await contentApiService.approveContent(parseInt(selectedContent.id), {
          notes: approvalNotes
        });
      } else if (currentAction === 'reject') {
        setRejecting(true);
        await contentApiService.rejectContent(parseInt(selectedContent.id), {
          notes: approvalNotes || 'No reason provided'
        });
      } else if (currentAction === 'request_changes') {
        await contentApiService.requestChanges(parseInt(selectedContent.id), {
          notes: approvalNotes || 'Please make revisions'
        });
      }

      // Refresh content list
      await fetchContents();
      
      // Reset state
      setApprovalNotes('');
      setShowApprovalNotes(false);
      setCurrentAction(null);
      
      // Show success message
      alert(`Nội dung đã được ${currentAction === 'approve' ? 'duyệt' : currentAction === 'reject' ? 'từ chối' : 'yêu cầu chỉnh sửa'} thành công!`);
    } catch (err) {
      console.error(`Error ${currentAction} content:`, err);
      alert(`Không thể ${currentAction === 'approve' ? 'duyệt' : currentAction === 'reject' ? 'từ chối' : 'yêu cầu chỉnh sửa'} nội dung. Vui lòng thử lại.`);
    } finally {
      setApproving(false);
      setRejecting(false);
    }
  };

  const cancelApprovalAction = () => {
    setApprovalNotes('');
    setShowApprovalNotes(false);
    setCurrentAction(null);
  };

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

  // Load content on component mount
  useEffect(() => {
    fetchContents();
  }, []);

  // Get image URL from content metadata or assets
  const getContentImageUrl = (content: ContentItem) => {
    if (content.imageUrl) return content.imageUrl;
    if (content.videoUrl) return content.videoUrl;
    
    // Check if there are assets in metadata
    if (content.contentMetadata && content.contentMetadata.assets && content.contentMetadata.assets.length > 0) {
      return content.contentMetadata.assets[0].url;
    }
    
    return null;
  };

  // Get content status display
  const getContentStatusDisplay = (content: ContentItem) => {
    if (content.approvalStatus === 'approved') return 'Đã duyệt';
    if (content.approvalStatus === 'rejected') return 'Đã từ chối';
    if (content.approvalStatus === 'changes_requested') return 'Cần chỉnh sửa';
    if (content.isPublished) return 'Đã đăng';
    if (content.status === 'scheduled') return 'Đã lên lịch';
    return 'Nháp';
  };

  // Get content status class
  const getContentStatusClass = (content: ContentItem) => {
    if (content.approvalStatus === 'approved') return 'approved';
    if (content.approvalStatus === 'rejected') return 'rejected';
    if (content.approvalStatus === 'changes_requested') return 'changes-requested';
    if (content.isPublished) return 'published';
    if (content.status === 'scheduled') return 'scheduled';
    return 'draft';
  };

  return (
    <MainLayout>
      <div className="content-page-youtube">
        {/* Header with refresh button */}
        <div className="content-header">
          <h1>Quản lý Nội dung</h1>
          <div className="header-actions">
            <button 
              className="refresh-btn"
              onClick={fetchContents}
              disabled={loading}
              title="Làm mới danh sách"
            >
              <IoRefresh /> {loading ? 'Đang tải...' : 'Làm mới'}
            </button>
            <button 
              className="config-btn"
              onClick={() => setShowConfig(true)}
              title="Cấu hình"
            >
              Cấu hình
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <IoAlertCircle /> {error}
          </div>
        )}

        {/* YouTube-style Two Column Layout */}
        <div className="content-layout">
          {/* Left: Content Preview (Social Media Post Style) */}
          <div className="content-preview">
            {selectedContent ? (
              <div className="preview-container">
                {/* Content Metadata Badge */}
                {selectedContent.contentMetadata && (
                  <div className="metadata-badge">
                    {selectedContent.contentMetadata.type === 'image_generation' && '🖼️ Ảnh từ AI'}
                    {selectedContent.contentMetadata.type === 'video_composition' && '🎬 Video từ ảnh'}
                  </div>
                )}

                {/* Post Content */}
                <div className="post-content">
                  <h2>{selectedContent.title}</h2>
                  <p className="post-description">{selectedContent.description}</p>
                  <div className="post-text">{selectedContent.content}</div>
                  
                  {/* Display content metadata if available */}
                  {selectedContent.contentMetadata && (
                    <div className="content-metadata">
                      <h4>Thông tin metadata:</h4>
                      <pre>{JSON.stringify(selectedContent.contentMetadata, null, 2)}</pre>
                    </div>
                  )}
                </div>

                {/* Post Media */}
                {getContentImageUrl(selectedContent) && (
                  <div className="post-media">
                    <img
                      src={getContentImageUrl(selectedContent) || ''}
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
                    <span>{selectedContent.comments || 0}</span>
                  </button>
                  <button className="action-btn">
                    <IoShareSocialOutline />
                    <span>{selectedContent.shares || 0}</span>
                  </button>
                </div>

                {/* Approval Actions */}
                <div className="approval-actions">
                  <button
                    className="approve-btn"
                    onClick={() => handleApprovalAction('approve')}
                    disabled={approving}
                    title="Duyệt nội dung này"
                  >
                    {approving ? 'Đang duyệt...' : '✓ Duyệt'}
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleApprovalAction('reject')}
                    disabled={rejecting}
                    title="Từ chối nội dung này"
                  >
                    {rejecting ? 'Đang từ chối...' : '✕ Từ chối'}
                  </button>
                  <button
                    className="request-changes-btn"
                    onClick={() => handleApprovalAction('request_changes')}
                    title="Yêu cầu chỉnh sửa"
                  >
                    ✎ Yêu cầu chỉnh sửa
                  </button>
                </div>

                {/* Approval Status */}
                {selectedContent.approvalStatus && (
                  <div className={`approval-status ${selectedContent.approvalStatus}`}>
                    Trạng thái: {getContentStatusDisplay(selectedContent)}
                    {selectedContent.approvedAt && (
                      <span className="approval-date">
                        · {new Date(selectedContent.approvedAt).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="preview-empty">
                {loading ? (
                  <p>Đang tải nội dung...</p>
                ) : contents.length === 0 ? (
                  <p>Không có nội dung nào cần duyệt</p>
                ) : (
                  <p>Chọn một nội dung để xem preview</p>
                )}
              </div>
            )}
          </div>

          {/* Right: Content List */}
          <div className="content-list">
            {loading ? (
              <div className="loading-state">
                <p>Đang tải danh sách nội dung...</p>
              </div>
            ) : contents.length === 0 ? (
              <div className="empty-state">
                <p>Không có nội dung nào cần duyệt</p>
              </div>
            ) : (
              contents.map((content: ContentItem) => (
                <div
                  key={content.id}
                  className={`content-item ${selectedContent?.id === content.id ? 'active' : ''} ${getContentStatusClass(content)}`}
                  onClick={() => handleSelectContent(content)}
                >
                  <div className="content-thumbnail">
                    {getContentImageUrl(content) ? (
                      <img
                        src={getContentImageUrl(content) || ''}
                        alt={content.title}
                      />
                    ) : (
                      <div className="thumbnail-placeholder">
                        <span>
                          {content.contentType === 'text' ? '📝' : 
                           content.contentType === 'image' ? '🖼️' : 
                           content.contentType === 'video' ? '🎬' : '📄'}
                        </span>
                      </div>
                    )}
                    <span className={`status-badge ${getContentStatusClass(content)}`}>
                      {getContentStatusDisplay(content)}
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
                        {content.likes || 0} ❤️ · {content.comments || 0} 💬
                      </span>
                    </div>
                    {/* Content metadata indicator */}
                    {content.contentMetadata && (
                      <div className="metadata-indicator">
                        {content.contentMetadata.type === 'image_generation' && '🖼️ AI Generated'}
                        {content.contentMetadata.type === 'video_composition' && '🎬 Video Composition'}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Approval Notes Modal */}
        {showApprovalNotes && (
          <div className="modal-overlay" onClick={cancelApprovalAction}>
            <div className="approval-notes-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  {currentAction === 'approve' ? 'Duyệt nội dung' : 
                   currentAction === 'reject' ? 'Từ chối nội dung' : 
                   'Yêu cầu chỉnh sửa'}
                </h2>
                <button
                  className="modal-close"
                  onClick={cancelApprovalAction}
                  title="Đóng"
                >
                  <IoClose />
                </button>
              </div>
              <div className="modal-body">
                <div className="notes-input">
                  <label htmlFor="approvalNotes">
                    {currentAction === 'approve' ? 'Ghi chú (tùy chọn):' : 
                     currentAction === 'reject' ? 'Lý do từ chối:' : 
                     'Yêu cầu chỉnh sửa:'}
                  </label>
                  <textarea
                    id="approvalNotes"
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    placeholder={
                      currentAction === 'approve' ? 'Nhập ghi chú nếu có...' : 
                      currentAction === 'reject' ? 'Nhập lý do từ chối...' : 
                      'Nhập yêu cầu chỉnh sửa...'
                    }
                    rows={4}
                  />
                </div>
                <div className="modal-actions">
                  <button
                    className="cancel-btn"
                    onClick={cancelApprovalAction}
                  >
                    Hủy
                  </button>
                  <button
                    className="submit-btn"
                    onClick={submitApprovalAction}
                    disabled={(!approvalNotes && currentAction !== 'approve') || approving || rejecting}
                  >
                    {approving ? 'Đang duyệt...' : 
                     rejecting ? 'Đang từ chối...' : 
                     currentAction === 'approve' ? 'Xác nhận duyệt' : 
                     currentAction === 'reject' ? 'Xác nhận từ chối' : 
                     'Gửi yêu cầu'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                  isSaving={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
