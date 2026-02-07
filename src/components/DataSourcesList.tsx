import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoAddCircle,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoSettings,
  IoTrash,
  IoCheckmark,
  IoClose,
  IoPlay,
  IoWarning,
  IoGlobe
} from 'react-icons/io5';
import { apiService } from '../services/api';
import type { DataSource, CreateDataSourceData, Brand } from '../types/brand';
import { LoadingSpinner } from './LoadingSpinner';
import '../styles/DataSourcesList.css';

interface DataSourceFormData {
  brand: number;
  platform_type: string;
  source_name: string;
  source_url?: string;
  crawl_frequency?: string;
  is_active?: boolean;
  notes?: string;
}

export const DataSourcesList: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<DataSourceFormData>({
    brand: 0,
    platform_type: 'social_media',
    source_name: '',
    source_url: '',
    crawl_frequency: 'daily',
    is_active: true,
    notes: ''
  });
  const [brands, setBrands] = useState<Brand[]>([]);

  const platformTypes = [
    { value: 'social_media', label: i18n.language === 'vi' ? 'Mạng xã hội' : 'Social Media' },
    { value: 'website', label: i18n.language === 'vi' ? 'Website' : 'Website' },
    { value: 'forum', label: i18n.language === 'vi' ? 'Diễn đàn' : 'Forum' },
    { value: 'marketplace', label: i18n.language === 'vi' ? 'Marketplace' : 'Marketplace' },
    { value: 'google_maps', label: 'Google Maps' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'community_group', label: i18n.language === 'vi' ? 'Nhóm cộng đồng' : 'Community Group' },
    { value: 'other', label: i18n.language === 'vi' ? 'Khác' : 'Other' }
  ];

  const crawlFrequencies = [
    { value: 'hourly', label: i18n.language === 'vi' ? 'Hàng giờ' : 'Hourly' },
    { value: 'daily', label: i18n.language === 'vi' ? 'Hàng ngày' : 'Daily' },
    { value: 'weekly', label: i18n.language === 'vi' ? 'Hàng tuần' : 'Weekly' },
    { value: 'monthly', label: i18n.language === 'vi' ? 'Hàng tháng' : 'Monthly' },
    { value: 'manual', label: i18n.language === 'vi' ? 'Thủ công' : 'Manual' },
    { value: 'custom', label: i18n.language === 'vi' ? 'Tùy chỉnh' : 'Custom' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch brands and data sources in parallel
      const [brandsResponse, dataSourcesResponse] = await Promise.all([
        apiService.getBrands(),
        apiService.getDataSources() // Get all data sources without brand filter
      ]);
      
      setBrands(brandsResponse.results || []);
      setDataSources(dataSourcesResponse.results || []);
      
      // Set default brand if available
      if (brandsResponse.results && brandsResponse.results.length > 0 && formData.brand === 0) {
        setFormData(prev => ({
          ...prev,
          brand: brandsResponse.results[0].id
        }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('brands.detail.error_loading');
      setError(errorMessage);
      console.error('Failed to fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSource = async () => {
    if (!formData.brand || !formData.source_name || !formData.platform_type) {
      setError(i18n.language === 'vi' ? 'Vui lòng chọn brand, điền tên nguồn và loại nguồn' : 'Please select brand, fill in source name and type');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const createData: CreateDataSourceData = {
        brand: formData.brand,
        platform_type: formData.platform_type,
        source_name: formData.source_name,
        source_url: formData.source_url || undefined,
        crawl_frequency: formData.crawl_frequency || 'daily',
        is_active: formData.is_active !== undefined ? formData.is_active : true,
        notes: formData.notes || undefined
      };

      await apiService.createDataSource(createData);
      await fetchData();
      
      // Reset form
      setFormData({
        brand: brands.length > 0 ? brands[0].id : 0,
        platform_type: 'social_media',
        source_name: '',
        source_url: '',
        crawl_frequency: 'daily',
        is_active: true,
        notes: ''
      });
      setShowForm(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('brands.detail.error_saving');
      setError(errorMessage);
      console.error('Failed to create data source:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleSource = async (id: number, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await apiService.deactivateDataSource(id);
      } else {
        await apiService.activateDataSource(id);
      }
      await fetchData();
    } catch (err) {
      console.error('Failed to toggle data source:', err);
      setError(i18n.language === 'vi' ? 'Không thể thay đổi trạng thái' : 'Failed to change status');
    }
  };

  const handleDeleteSource = async (id: number) => {
    if (!confirm(i18n.language === 'vi' ? 'Bạn có chắc chắn muốn xóa nguồn dữ liệu này?' : 'Are you sure you want to delete this data source?')) {
      return;
    }

    try {
      await apiService.deleteDataSource(id);
      await fetchData();
    } catch (err) {
      console.error('Failed to delete data source:', err);
      setError(i18n.language === 'vi' ? 'Không thể xóa nguồn dữ liệu' : 'Failed to delete data source');
    }
  };

  const handleCrawlNow = async (id: number) => {
    try {
      await apiService.crawlDataSource(id);
      // Show success message
      alert(i18n.language === 'vi' ? 'Đã kích hoạt crawl ngay lập tức' : 'Triggered immediate crawl');
      await fetchData();
    } catch (err) {
      console.error('Failed to trigger crawl:', err);
      setError(i18n.language === 'vi' ? 'Không thể kích hoạt crawl' : 'Failed to trigger crawl');
    }
  };

  const handleFormChange = (field: keyof DataSourceFormData, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return i18n.language === 'vi' ? 'Chưa crawl' : 'Never crawled';
    
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
    } else {
      return i18n.language === 'vi' ? `${diffDays} ngày trước` : `${diffDays} days ago`;
    }
  };

  const getBrandName = (brandId: number) => {
    const brand = brands.find(b => b.id === brandId);
    return brand ? brand.name : `Brand #${brandId}`;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="data-sources-wrapper">
      <div className="data-sources-header">
        <div>
          <h1 className="data-sources-title">
            {i18n.language === 'vi' ? 'Nguồn dữ liệu crawl' : 'Data Sources'}
          </h1>
          <p className="data-sources-subtitle">
            {i18n.language === 'vi' 
              ? 'Cấu hình các nguồn dữ liệu mà AI sẽ crawl để phân tích thị trường và tìm kiếm khách hàng tiềm năng'
              : 'Configure data sources that AI will crawl to analyze market and find potential customers'}
          </p>
        </div>
        <button 
          className="add-source-button" 
          onClick={() => setShowForm(!showForm)}
          disabled={isSubmitting}
        >
          <IoAddCircle className="button-icon" />
          <span>{i18n.language === 'vi' ? 'Thêm nguồn' : 'Add Source'}</span>
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <IoWarning className="error-icon" />
          <p>{error}</p>
          <button onClick={() => setError(null)}>
            <IoClose />
          </button>
        </div>
      )}

      {showForm && (
        <div className="add-source-form">
          <div className="form-group">
            <label className="form-label">
              {i18n.language === 'vi' ? 'Brand *' : 'Brand *'}
            </label>
            <select
              value={formData.brand}
              onChange={(e) => handleFormChange('brand', parseInt(e.target.value))}
              className="form-select"
              disabled={isSubmitting}
            >
              <option value="0">{i18n.language === 'vi' ? 'Chọn brand' : 'Select brand'}</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              {i18n.language === 'vi' ? 'Tên nguồn *' : 'Source Name *'}
            </label>
            <input
              type="text"
              placeholder={i18n.language === 'vi' ? 'VD: Facebook Groups' : 'e.g., Facebook Groups'}
              value={formData.source_name}
              onChange={(e) => handleFormChange('source_name', e.target.value)}
              className="form-input"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {i18n.language === 'vi' ? 'Loại nguồn *' : 'Source Type *'}
            </label>
            <select
              value={formData.platform_type}
              onChange={(e) => handleFormChange('platform_type', e.target.value)}
              className="form-select"
              disabled={isSubmitting}
            >
              {platformTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              {i18n.language === 'vi' ? 'URL (tùy chọn)' : 'URL (optional)'}
            </label>
            <input
              type="text"
              placeholder={i18n.language === 'vi' ? 'VD: https://facebook.com/groups/tech' : 'e.g., https://facebook.com/groups/tech'}
              value={formData.source_url || ''}
              onChange={(e) => handleFormChange('source_url', e.target.value)}
              className="form-input"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {i18n.language === 'vi' ? 'Tần suất crawl' : 'Crawl Frequency'}
            </label>
            <select
              value={formData.crawl_frequency}
              onChange={(e) => handleFormChange('crawl_frequency', e.target.value)}
              className="form-select"
              disabled={isSubmitting}
            >
              {crawlFrequencies.map(freq => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label checkbox-label">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => handleFormChange('is_active', e.target.checked)}
                disabled={isSubmitting}
              />
              <span>{i18n.language === 'vi' ? 'Kích hoạt crawl' : 'Enable crawling'}</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">
              {i18n.language === 'vi' ? 'Ghi chú (tùy chọn)' : 'Notes (optional)'}
            </label>
            <textarea
              placeholder={i18n.language === 'vi' ? 'Ghi chú về nguồn dữ liệu...' : 'Notes about the data source...'}
              value={formData.notes || ''}
              onChange={(e) => handleFormChange('notes', e.target.value)}
              className="form-textarea"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-actions">
            <button 
              className="form-button button-success" 
              onClick={handleAddSource}
              disabled={isSubmitting || !formData.brand || !formData.source_name || !formData.platform_type}
            >
              <IoCheckmark className="button-icon" />
              {isSubmitting ? (i18n.language === 'vi' ? 'Đang thêm...' : 'Adding...') : (i18n.language === 'vi' ? 'Thêm' : 'Add')}
            </button>
            <button 
              className="form-button button-cancel" 
              onClick={() => setShowForm(false)}
              disabled={isSubmitting}
            >
              <IoClose className="button-icon" />
              {i18n.language === 'vi' ? 'Hủy' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {dataSources.length === 0 && !showForm ? (
        <div className="empty-state">
          <IoSettings className="empty-icon" />
          <h3>{i18n.language === 'vi' ? 'Chưa có nguồn dữ liệu' : 'No Data Sources Yet'}</h3>
          <p>
            {i18n.language === 'vi' 
              ? 'Thêm một nguồn dữ liệu để bắt đầu crawl và phân tích thị trường'
              : 'Add a data source to start crawling and analyzing market'}
          </p>
        </div>
      ) : (
        <div className="sources-grid">
          {dataSources.map(source => (
            <div key={source.id} className={`source-card ${source.is_active ? 'active' : 'inactive'}`}>
              <div className="source-header">
                <div className="source-info">
                  <h3 className="source-name">{source.source_name}</h3>
                  <p className="source-type">
                    {platformTypes.find(t => t.value === source.platform_type)?.label || source.platform_type_display}
                  </p>
                  <p className="source-brand">
                    <IoGlobe className="brand-icon" />
                    {getBrandName(source.brand)}
                  </p>
                  {source.source_url && (
                    <p className="source-url">
                      <a href={source.source_url} target="_blank" rel="noopener noreferrer" className="url-link">
                        {source.source_url}
                      </a>
                    </p>
                  )}
                  <p className="source-meta">
                    <span className="meta-item">
                      {i18n.language === 'vi' ? 'Tần suất: ' : 'Frequency: '}
                      <strong>{crawlFrequencies.find(f => f.value === source.crawl_frequency)?.label || source.crawl_frequency_display}</strong>
                    </span>
                  </p>
                </div>
                <div className="source-status">
                  {source.is_active ? (
                    <IoCheckmarkCircle className="status-icon active" title={i18n.language === 'vi' ? 'Đang hoạt động' : 'Active'} />
                  ) : (
                    <IoCloseCircle className="status-icon inactive" title={i18n.language === 'vi' ? 'Đã tắt' : 'Inactive'} />
                  )}
                </div>
              </div>

              <div className="source-footer">
                <div className="source-meta">
                  <span className="last-sync">
                    {i18n.language === 'vi' ? 'Crawl cuối: ' : 'Last crawled: '}
                    {formatDate(source.last_crawled_at)}
                  </span>
                  {source.notes && (
                    <span className="source-notes" title={source.notes}>
                      📝 {i18n.language === 'vi' ? 'Có ghi chú' : 'Has notes'}
                    </span>
                  )}
                </div>
                <div className="source-actions">
                  <button
                    className="action-button crawl"
                    onClick={() => handleCrawlNow(source.id)}
                    title={i18n.language === 'vi' ? 'Crawl ngay' : 'Crawl now'}
                  >
                    <IoPlay className="action-icon" />
                  </button>
                  <button
                    className="action-button toggle"
                    onClick={() => handleToggleSource(source.id, source.is_active)}
                    title={source.is_active ? (i18n.language === 'vi' ? 'Tắt' : 'Disable') : (i18n.language === 'vi' ? 'Bật' : 'Enable')}
                  >
                    {source.is_active ? (
                      <IoCheckmarkCircle className="action-icon" />
                    ) : (
                      <IoCloseCircle className="action-icon" />
                    )}
                  </button>
                  <button
                    className="action-button delete"
                    onClick={() => handleDeleteSource(source.id)}
                    title={i18n.language === 'vi' ? 'Xóa' : 'Delete'}
                  >
                    <IoTrash className="action-icon" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
