import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoChevronDown,
  IoChevronUp,
  IoDocumentText,
  IoCode,
  IoImage,
  IoVideocam,
  IoMusicalNote,
  IoDocument,
  IoGlobe,
  IoTime,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoArrowBack,
  IoSearch,
  IoFilter
} from 'react-icons/io5';
import { apiService, type CrawledContentDetail, type CrawlHistoryResponse } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import '../styles/CrawlHistory.css';

interface CrawlHistoryProps {
  sourceUrl?: string;
  crawlSourceId?: number;
  sourceName?: string;
  onClose?: () => void;
}

export const CrawlHistory: React.FC<CrawlHistoryProps> = ({
  sourceUrl,
  crawlSourceId,
  sourceName,
  onClose
}) => {
  const { t, i18n } = useTranslation();
  const [crawlHistory, setCrawlHistory] = useState<CrawlHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedContentId, setExpandedContentId] = useState<number | null>(null);
  const [contentDetail, setContentDetail] = useState<CrawledContentDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');

  useEffect(() => {
    if (sourceUrl || crawlSourceId) {
      fetchCrawlHistory();
    }
  }, [sourceUrl, crawlSourceId, page]);

  const fetchCrawlHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getCrawlHistory(
        sourceUrl,
        crawlSourceId,
        page,
        pageSize
      );
      
      setCrawlHistory(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('crawl_history.error_loading');
      setError(errorMessage);
      console.error('Failed to fetch crawl history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = async (contentId: number) => {
    if (expandedContentId === contentId) {
      setExpandedContentId(null);
      setContentDetail(null);
      return;
    }

    try {
      setIsLoadingDetail(true);
      const detail = await apiService.getCrawledContentDetail(contentId);
      setContentDetail(detail);
      setExpandedContentId(contentId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('crawl_history.error_loading_detail');
      setError(errorMessage);
      console.error('Failed to fetch content detail:', err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return i18n.language === 'vi' ? `${diffMins} phút trước` : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return i18n.language === 'vi' ? `${diffHours} giờ trước` : `${diffHours} hours ago`;
    } else if (diffDays < 30) {
      return i18n.language === 'vi' ? `${diffDays} ngày trước` : `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'text':
        return <IoDocumentText className="content-type-icon text" />;
      case 'html':
        return <IoCode className="content-type-icon html" />;
      case 'json':
        return <IoCode className="content-type-icon json" />;
      case 'image':
        return <IoImage className="content-type-icon image" />;
      case 'video':
        return <IoVideocam className="content-type-icon video" />;
      case 'audio':
        return <IoMusicalNote className="content-type-icon audio" />;
      case 'document':
        return <IoDocument className="content-type-icon document" />;
      default:
        return <IoGlobe className="content-type-icon other" />;
    }
  };

  const getContentTypeColor = (contentType: string) => {
    switch (contentType) {
      case 'text': return '#10b981';
      case 'html': return '#3b82f6';
      case 'json': return '#8b5cf6';
      case 'image': return '#ef4444';
      case 'video': return '#f59e0b';
      case 'audio': return '#ec4899';
      case 'document': return '#6366f1';
      default: return '#6b7280';
    }
  };

  const truncateText = (text: string | null, maxLength: number = 100) => {
    if (!text) return i18n.language === 'vi' ? 'Không có nội dung' : 'No content';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const filteredResults = crawlHistory?.results.filter(content => {
    // Apply search filter
    const matchesSearch = searchQuery === '' || 
      (content.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (content.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      content.source_url.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply content type filter
    const matchesContentType = contentTypeFilter === 'all' || content.content_type === contentTypeFilter;
    
    return matchesSearch && matchesContentType;
  }) || [];

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil((crawlHistory?.count || 0) / pageSize)) {
      setPage(newPage);
    }
  };

  const totalPages = Math.ceil((crawlHistory?.count || 0) / pageSize);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="crawl-history-wrapper">
      <div className="crawl-history-header">
        <div className="header-left">
          {onClose && (
            <button className="back-button" onClick={onClose}>
              <IoArrowBack className="back-icon" />
              <span>{i18n.language === 'vi' ? 'Quay lại' : 'Back'}</span>
            </button>
          )}
          <div>
            <h1 className="crawl-history-title">
              {i18n.language === 'vi' ? 'Lịch sử Crawl' : 'Crawl History'}
            </h1>
            <p className="crawl-history-subtitle">
              {sourceName && (
                <span className="source-name">{sourceName}</span>
              )}
              {sourceUrl && (
                <span className="source-url">
                  <IoGlobe className="url-icon" />
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                    {sourceUrl}
                  </a>
                </span>
              )}
              <span className="total-count">
                {i18n.language === 'vi' ? 'Tổng cộng ' : 'Total '}
                {crawlHistory?.count || 0} {i18n.language === 'vi' ? 'lần crawl' : 'crawls'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>
            <IoCloseCircle />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="crawl-history-filters">
        <div className="search-filter">
          <IoSearch className="search-icon" />
          <input
            type="text"
            placeholder={i18n.language === 'vi' ? 'Tìm kiếm nội dung...' : 'Search content...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <IoFilter className="filter-icon" />
          <select
            value={contentTypeFilter}
            onChange={(e) => setContentTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">{i18n.language === 'vi' ? 'Tất cả loại nội dung' : 'All Content Types'}</option>
            <option value="text">{i18n.language === 'vi' ? 'Văn bản' : 'Text'}</option>
            <option value="html">HTML</option>
            <option value="json">JSON</option>
            <option value="image">{i18n.language === 'vi' ? 'Hình ảnh' : 'Image'}</option>
            <option value="video">{i18n.language === 'vi' ? 'Video' : 'Video'}</option>
            <option value="audio">{i18n.language === 'vi' ? 'Âm thanh' : 'Audio'}</option>
            <option value="document">{i18n.language === 'vi' ? 'Tài liệu' : 'Document'}</option>
            <option value="other">{i18n.language === 'vi' ? 'Khác' : 'Other'}</option>
          </select>
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <div className="empty-state">
          <IoDocumentText className="empty-icon" />
          <h3>{i18n.language === 'vi' ? 'Chưa có lịch sử crawl' : 'No Crawl History Yet'}</h3>
          <p>
            {i18n.language === 'vi' 
              ? 'Chưa có dữ liệu crawl nào được tìm thấy cho nguồn này'
              : 'No crawl data found for this source yet'}
          </p>
        </div>
      ) : (
        <>
          <div className="crawl-history-list">
            {filteredResults.map(content => (
              <div key={content.id} className="crawl-history-item">
                <div className="item-header">
                  <div className="item-info">
                    <div className="content-type-badge">
                      {getContentTypeIcon(content.content_type)}
                      <span 
                        className="content-type-label"
                        style={{ color: getContentTypeColor(content.content_type) }}
                      >
                        {content.content_type_display}
                      </span>
                    </div>
                    
                    <div className="item-meta">
                      <span className="meta-item">
                        <IoTime className="meta-icon" />
                        {formatDate(content.crawled_at)}
                      </span>
                      
                      {content.crawl_duration_seconds && (
                        <span className="meta-item">
                          {i18n.language === 'vi' ? 'Thời gian: ' : 'Duration: '}
                          <strong>{content.crawl_duration_seconds.toFixed(2)}s</strong>
                        </span>
                      )}
                      
                      {content.page_size_bytes && (
                        <span className="meta-item">
                          {i18n.language === 'vi' ? 'Kích thước: ' : 'Size: '}
                          <strong>
                            {content.page_size_bytes > 1024 * 1024 
                              ? `${(content.page_size_bytes / (1024 * 1024)).toFixed(2)} MB`
                              : content.page_size_bytes > 1024
                                ? `${(content.page_size_bytes / 1024).toFixed(2)} KB`
                                : `${content.page_size_bytes} bytes`
                            }
                          </strong>
                        </span>
                      )}
                      
                      <span className="meta-item">
                        {content.is_processed ? (
                          <>
                            <IoCheckmarkCircle className="meta-icon processed" />
                            <span className="processed-text">
                              {i18n.language === 'vi' ? 'Đã xử lý' : 'Processed'}
                            </span>
                          </>
                        ) : (
                          <>
                            <IoCloseCircle className="meta-icon not-processed" />
                            <span className="not-processed-text">
                              {i18n.language === 'vi' ? 'Chưa xử lý' : 'Not Processed'}
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    className="view-detail-button"
                    onClick={() => handleViewDetail(content.id)}
                    disabled={isLoadingDetail && expandedContentId === content.id}
                  >
                    {expandedContentId === content.id ? (
                      <>
                        <IoChevronUp className="detail-icon" />
                        <span>{i18n.language === 'vi' ? 'Ẩn chi tiết' : 'Hide Detail'}</span>
                      </>
                    ) : (
                      <>
                        <IoChevronDown className="detail-icon" />
                        <span>{i18n.language === 'vi' ? 'Xem chi tiết' : 'View Detail'}</span>
                      </>
                    )}
                  </button>
                </div>
                
                {content.title && (
                  <h3 className="item-title">{content.title}</h3>
                )}
                
                {content.description && (
                  <p className="item-description">{truncateText(content.description, 150)}</p>
                )}
                
                {expandedContentId === content.id && (
                  <div className="item-detail">
                    {isLoadingDetail ? (
                      <div className="detail-loading">
                        <LoadingSpinner />
                        <span>{i18n.language === 'vi' ? 'Đang tải chi tiết...' : 'Loading detail...'}</span>
                      </div>
                    ) : contentDetail ? (
                      <div className="detail-content">
                        <div className="detail-section">
                          <h4>{i18n.language === 'vi' ? 'Nội dung thô' : 'Raw Content'}</h4>
                          <div className="raw-content-wrapper">
                            <pre className="raw-content">
                              {contentDetail.raw_content || 
                                (i18n.language === 'vi' ? 'Không có nội dung thô' : 'No raw content')}
                            </pre>
                          </div>
                        </div>
                        
                        {contentDetail.processed_content && (
                          <div className="detail-section">
                            <h4>{i18n.language === 'vi' ? 'Nội dung đã xử lý' : 'Processed Content'}</h4>
                            <div className="processed-content-wrapper">
                              <pre className="processed-content">
                                {JSON.stringify(contentDetail.processed_content, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                        
                        {contentDetail.processing_error && (
                          <div className="detail-section error">
                            <h4>{i18n.language === 'vi' ? 'Lỗi xử lý' : 'Processing Error'}</h4>
                            <div className="error-wrapper">
                              <pre className="error-content">
                                {contentDetail.processing_error}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="detail-error">
                        {i18n.language === 'vi' 
                          ? 'Không thể tải chi tiết nội dung' 
                          : 'Failed to load content detail'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                {i18n.language === 'vi' ? 'Trước' : 'Previous'}
              </button>
              
              <div className="pagination-info">
                {i18n.language === 'vi' ? 'Trang ' : 'Page '}
                <strong>{page}</strong> {i18n.language === 'vi' ? 'của ' : 'of '}
                <strong>{totalPages}</strong>
              </div>
              
              <button
                className="pagination-button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
              >
                {i18n.language === 'vi' ? 'Sau' : 'Next'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};