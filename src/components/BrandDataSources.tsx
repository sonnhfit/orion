import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoAddCircle,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoTrash,
  IoCheckmark,
  IoClose,
  IoGlobe
} from 'react-icons/io5';
import '../styles/BrandDataSources.css';

interface DataSource {
  id: string;
  name: string;
  type: 'social_media' | 'website' | 'forum' | 'marketplace' | 'google_maps' | 'youtube' | 'linkedin' | 'tiktok' | 'community_group';
  platform?: string;
  url?: string;
  enabled: boolean;
  lastSync?: string;
  brandId?: string;
}

interface BrandDataSourcesProps {
  brandId?: string;
  brandName?: string;
}

interface DataSourceInput {
  name: string;
  type: string;
  platform?: string;
  url?: string;
}

export const BrandDataSources: React.FC<BrandDataSourcesProps> = ({ 
  brandId, 
  brandName = 'This Brand' 
}) => {
  const { i18n } = useTranslation();
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'Facebook Groups',
      type: 'social_media',
      platform: 'Facebook',
      enabled: true,
      lastSync: '2 hours ago',
      brandId: brandId
    },
    {
      id: '2',
      name: 'LinkedIn Posts',
      type: 'linkedin',
      platform: 'LinkedIn',
      enabled: true,
      lastSync: '4 hours ago',
      brandId: brandId
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<DataSourceInput>({
    name: '',
    type: 'social_media',
    platform: '',
    url: ''
  });

  const sourceTypes = [
    { value: 'social_media', label: i18n.language === 'vi' ? 'Mạng xã hội' : 'Social Media' },
    { value: 'website', label: i18n.language === 'vi' ? 'Website' : 'Website' },
    { value: 'forum', label: i18n.language === 'vi' ? 'Diễn đàn' : 'Forum' },
    { value: 'marketplace', label: i18n.language === 'vi' ? 'Marketplace' : 'Marketplace' },
    { value: 'google_maps', label: 'Google Maps' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'community_group', label: i18n.language === 'vi' ? 'Nhóm cộng đồng' : 'Community Group' }
  ];

  const handleAddSource = () => {
    if (formData.name && formData.type) {
      const newSource: DataSource = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type as DataSource['type'],
        platform: formData.platform,
        url: formData.url,
        enabled: true,
        lastSync: i18n.language === 'vi' ? 'Vừa mới' : 'Just now',
        brandId: brandId
      };
      setDataSources([...dataSources, newSource]);
      setFormData({
        name: '',
        type: 'social_media',
        platform: '',
        url: ''
      });
      setShowForm(false);
    }
  };

  const handleToggleSource = (id: string) => {
    setDataSources(dataSources.map(source =>
      source.id === id ? { ...source, enabled: !source.enabled } : source
    ));
  };

  const handleDeleteSource = (id: string) => {
    setDataSources(dataSources.filter(source => source.id !== id));
  };

  const handleFormChange = (field: keyof DataSourceInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="brand-data-sources-wrapper">
      <div className="data-sources-section-header">
        <div className="section-header-info">
          <IoGlobe className="section-icon" />
          <div>
            <h3 className="section-title">
              {i18n.language === 'vi' ? 'Nguồn dữ liệu crawl' : 'Data Sources'}
            </h3>
            <p className="section-description">
              {i18n.language === 'vi' 
                ? `Cấu hình các nguồn dữ liệu mà AI sẽ crawl cho ${brandName}`
                : `Configure data sources that AI will crawl for ${brandName}`}
            </p>
          </div>
        </div>
        <button className="add-source-button" onClick={() => setShowForm(!showForm)}>
          <IoAddCircle className="button-icon" />
          <span>{i18n.language === 'vi' ? 'Thêm nguồn' : 'Add Source'}</span>
        </button>
      </div>

      {showForm && (
        <div className="add-source-form">
          <div className="form-group">
            <label className="form-label">
              {i18n.language === 'vi' ? 'Tên nguồn' : 'Source Name'}
            </label>
            <input
              type="text"
              placeholder={i18n.language === 'vi' ? 'VD: Facebook Groups' : 'e.g., Facebook Groups'}
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {i18n.language === 'vi' ? 'Loại nguồn' : 'Source Type'}
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleFormChange('type', e.target.value)}
              className="form-select"
            >
              {sourceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              {i18n.language === 'vi' ? 'Nền tảng (tùy chọn)' : 'Platform (optional)'}
            </label>
            <input
              type="text"
              placeholder={i18n.language === 'vi' ? 'VD: Facebook, LinkedIn' : 'e.g., Facebook, LinkedIn'}
              value={formData.platform}
              onChange={(e) => handleFormChange('platform', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {i18n.language === 'vi' ? 'URL (tùy chọn)' : 'URL (optional)'}
            </label>
            <input
              type="text"
              placeholder={i18n.language === 'vi' ? 'VD: https://example.com' : 'e.g., https://example.com'}
              value={formData.url}
              onChange={(e) => handleFormChange('url', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <button 
              className="form-button button-success" 
              onClick={handleAddSource}
            >
              <IoCheckmark className="button-icon" />
              {i18n.language === 'vi' ? 'Thêm' : 'Add'}
            </button>
            <button 
              className="form-button button-cancel" 
              onClick={() => setShowForm(false)}
            >
              <IoClose className="button-icon" />
              {i18n.language === 'vi' ? 'Hủy' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {dataSources.length === 0 && !showForm ? (
        <div className="empty-state">
          <div className="empty-icon">🔗</div>
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
            <div key={source.id} className={`source-card ${source.enabled ? 'active' : 'inactive'}`}>
              <div className="source-header">
                <div className="source-info">
                  <h3 className="source-name">{source.name}</h3>
                  <p className="source-type">
                    {sourceTypes.find(t => t.value === source.type)?.label}
                  </p>
                  {source.platform && (
                    <p className="source-platform">{source.platform}</p>
                  )}
                  {brandId && (
                    <p className="source-brand">
                      📌 {i18n.language === 'vi' ? 'Cho:' : 'For:'} <strong>{brandName}</strong>
                    </p>
                  )}
                </div>
                <div className="source-status">
                  {source.enabled ? (
                    <IoCheckmarkCircle className="status-icon active" />
                  ) : (
                    <IoCloseCircle className="status-icon inactive" />
                  )}
                </div>
              </div>

              {source.url && (
                <div className="source-url">
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="url-link">
                    {source.url}
                  </a>
                </div>
              )}

              <div className="source-footer">
                <div className="source-meta">
                  {source.lastSync && (
                    <span className="last-sync">
                      {i18n.language === 'vi' ? 'Cập nhật: ' : 'Last sync: '}{source.lastSync}
                    </span>
                  )}
                </div>
                <div className="source-actions">
                  <button
                    className="action-button toggle"
                    onClick={() => handleToggleSource(source.id)}
                    title={source.enabled ? 'Disable' : 'Enable'}
                  >
                    {source.enabled ? (
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
