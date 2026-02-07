import React, { useState } from 'react';
import { IoGrid, IoSwapVertical, IoChevronBack, IoChevronForward, IoEye, IoHeartOutline, IoHeart, IoChatbubbleOutline } from 'react-icons/io5';
import type { ContentItem } from '../types/content';
import '../styles/ContentBrowser.css';

interface ContentBrowserProps {
  contents: ContentItem[];
  onSelectContent: (content: ContentItem) => void;
  isLoading?: boolean;
}

type ViewMode = 'grid' | 'tinder';

export const ContentBrowser: React.FC<ContentBrowserProps> = ({ contents, onSelectContent, isLoading = false }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [likedContent, setLikedContent] = useState<Set<string>>(new Set());

  const handleNextCard = () => {
    if (currentCardIndex < contents.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
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

  const currentContent = contents[currentCardIndex];

  if (isLoading) {
    return <div className="content-browser loading">Đang tải nội dung...</div>;
  }

  if (contents.length === 0) {
    return (
      <div className="content-browser empty">
        <div className="empty-state">
          <p>Chưa có nội dung nào</p>
          <span>Tạo nội dung đầu tiên của bạn để bắt đầu</span>
        </div>
      </div>
    );
  }

  return (
    <div className="content-browser">
      <div className="view-controls">
        <button
          className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => setViewMode('grid')}
          title="Chế độ lưới"
        >
          <IoGrid /> Lưới
        </button>
        <button
          className={`view-btn ${viewMode === 'tinder' ? 'active' : ''}`}
          onClick={() => setViewMode('tinder')}
          title="Chế độ Tinder"
        >
          <IoSwapVertical /> Swipe
        </button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid-view">
          {contents.map((content) => (
            <div
              key={content.id}
              className="content-card"
              onClick={() => onSelectContent(content)}
            >
              <div className="card-image-wrapper">
                {content.imageUrl ? (
                  <img src={content.imageUrl} alt={content.title} className="card-image" />
                ) : (
                  <div className="card-placeholder">
                    <span>{content.contentType === 'text' ? 'Text' : content.contentType}</span>
                  </div>
                )}
                <div className="card-overlay">
                  <IoEye className="view-icon" />
                </div>
              </div>
              <div className="card-content">
                <h4 className="card-title">{content.title}</h4>
                <p className="card-description">{content.description}</p>
                <div className="card-meta">
                  <span className={`status ${content.status}`}>{content.status}</span>
                  <span className="date">{new Date(content.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="tinder-view">
          {currentContent && (
            <div className="tinder-card">
              <div className="card-image-wrapper">
                {currentContent.imageUrl ? (
                  <img src={currentContent.imageUrl} alt={currentContent.title} />
                ) : (
                  <div className="card-placeholder">
                    <span>{currentContent.contentType}</span>
                  </div>
                )}
              </div>

              <div className="card-details">
                <h3 className="card-title">{currentContent.title}</h3>
                <p className="card-description">{currentContent.description}</p>
                <p className="card-content-text">{currentContent.content}</p>

                <div className="card-stats">
                  <div className="stat-item">
                    <IoEye className="stat-icon" />
                    <span>{currentContent.likes || 0}</span>
                  </div>
                  <div className="stat-item">
                    <IoChatbubbleOutline className="stat-icon" />
                    <span>{currentContent.comments || 0}</span>
                  </div>
                </div>

                <div className="card-meta">
                  <span className={`status ${currentContent.status}`}>{currentContent.status}</span>
                  <span className="date">
                    {new Date(currentContent.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>

              <div className="tinder-actions">
                <button
                  className="action-btn dislike"
                  onClick={handlePrevCard}
                  disabled={currentCardIndex === 0}
                  title="Quay lại"
                >
                  <IoChevronBack />
                </button>

                <button
                  className={`action-btn like ${likedContent.has(currentContent.id) ? 'liked' : ''}`}
                  onClick={() => toggleLike(currentContent.id)}
                  title="Yêu thích"
                >
                  {likedContent.has(currentContent.id) ? <IoHeart /> : <IoHeartOutline />}
                </button>

                <button
                  className="action-btn next"
                  onClick={handleNextCard}
                  disabled={currentCardIndex === contents.length - 1}
                  title="Tiếp theo"
                >
                  <IoChevronForward />
                </button>

                <button
                  className="action-btn view"
                  onClick={() => onSelectContent(currentContent)}
                  title="Xem chi tiết"
                >
                  <IoEye />
                </button>
              </div>

              <div className="tinder-counter">
                {currentCardIndex + 1} / {contents.length}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
