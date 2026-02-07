import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { IoArrowBack, IoAdd, IoClose, IoCheckmarkCircle, IoChevronDown, IoColorFill, IoDocument, IoSettings } from 'react-icons/io5';
import { MdCheckCircle } from 'react-icons/md';
import { apiService } from '../services/api';
import type { Brand, BrandSettings, SocialAccount } from '../types/brand';
import { LoadingSpinner } from './LoadingSpinner';
import '../styles/BrandDetail.css';

export const BrandDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { brandSlug } = useParams<{ brandSlug: string }>();
  
  const [brand, setBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    info: true,
    social: true,
    settings: true,
  });
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [settingsData, setSettingsData] = useState<Partial<BrandSettings>>({
    color_primary: '#000000',
    color_secondary: '#ffffff',
    brand_voice: '',
    brand_values: '',
    content_categories: '',
    content_language: 'en',
    posts_per_week: 3,
    auto_respond_enabled: false,
    auto_respond_message: '',
    lead_scoring_enabled: false,
  });

  useEffect(() => {
    fetchBrandDetails();
  }, [brandSlug]);

  const fetchBrandDetails = async () => {
    if (!brandSlug) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const brandData = await apiService.getBrand(brandSlug);
      setBrand(brandData);
      
      setFormData({
        name: brandData.name,
        description: brandData.description || '',
      });

      if (brandData.settings) {
        setSettingsData(brandData.settings);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('brands.detail.error_loading');
      setError(errorMessage);
      console.error('Failed to fetch brand details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBrandInfo = async () => {
    if (!brand) return;

    try {
      setIsSavingSettings(true);
      await apiService.updateBrand(brand.slug, {
        name: formData.name,
        description: formData.description,
      });
      await fetchBrandDetails();
      setIsEditingInfo(false);
    } catch (err) {
      console.error('Failed to update brand info:', err);
      setError(t('brands.detail.error_saving'));
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!brand) return;

    try {
      setIsSavingSettings(true);
      console.log('Saving settings:', settingsData);
      setTimeout(() => {
        setIsSavingSettings(false);
      }, 1000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError(t('brands.detail.error_saving'));
      setIsSavingSettings(false);
    }
  };

  const handleDeleteBrand = async () => {
    if (!brand) return;

    try {
      setIsDeleting(true);
      await apiService.deleteBrand(brand.slug);
      navigate('/brand-kit');
    } catch (err) {
      console.error('Failed to delete brand:', err);
      setError(t('brands.detail.error_saving'));
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSettingsChange = (field: keyof typeof settingsData, value: any) => {
    setSettingsData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleColorChange = (field: keyof typeof settingsData, value: string) => {
    // Validate hex color format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (value.match(hexRegex) || value === '') {
      handleSettingsChange(field, value);
    }
  };

  const isValidHexColor = (color: string): boolean => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color);
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!brand) {
    return (
      <div className="brand-detail-error">
        <h2>{t('brands.detail.not_found')}</h2>
        <button className="btn-back" onClick={() => navigate('/brand-kit')}>
          <IoArrowBack /> {t('brands.detail.back_to_brands')}
        </button>
      </div>
    );
  }

  return (
    <div className="brand-detail-container">
      {/* Header */}
      <div className="brand-detail-header">
        <button className="btn-back" onClick={() => navigate('/brand-kit')}>
          <IoArrowBack /> {t('brands.detail.back_to_brands')}
        </button>
        <h1 className="brand-detail-title">{brand.name}</h1>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>
            <IoClose />
          </button>
        </div>
      )}

      <div className="brand-detail-content">
        {/* Info Banner */}
        <div className="info-banner">
          <div className="info-banner-content">
            <div className="info-banner-icon">ℹ️</div>
            <div className="info-banner-text">
              <p>{t('brands.detail.brand_info_description') || 'Manage your brand information and settings'}</p>
            </div>
            <button className="btn-primary btn-sm">
              {t('brands.detail.learn_more')}
            </button>
          </div>
          <button className="info-banner-close" onClick={() => setError(null)}>
            <IoClose />
          </button>
        </div>

        {/* Brand Info Accordion */}
        <div className="section accordion-section">
          <button 
            className={`accordion-header ${expandedSections.info ? 'expanded' : ''}`}
            onClick={() => toggleSection('info')}
          >
            <div className="accordion-status">
              <MdCheckCircle />
            </div>
            <div className="accordion-content-main">
              <h3 className="accordion-title">1. {t('brands.detail.brand_info')}</h3>
              <p className="accordion-desc">{t('brands.detail.manage_brand_info')}</p>
            </div>
            <div className="accordion-chevron">
              <IoChevronDown />
            </div>
          </button>

          {expandedSections.info && (
            <div className="accordion-body expanded">
              {isEditingInfo ? (
                <div className="form-section">
                  <div className="form-group">
                    <label>{t('brands.detail.brand_name')}</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                      placeholder="Enter brand name"
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('brands.detail.brand_description')}</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="form-textarea"
                      rows={5}
                      placeholder="Describe your brand..."
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      className="btn-primary"
                      onClick={handleUpdateBrandInfo}
                      disabled={isSavingSettings}
                    >
                      {isSavingSettings ? t('brands.detail.saving') : t('brands.detail.save_settings')}
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => setIsEditingInfo(false)}
                      disabled={isSavingSettings}
                    >
                      {t('brands.detail.cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="info-display">
                  <div className="info-item">
                    <span className="info-label">{t('brands.detail.brand_name')}</span>
                    <span className="info-value">{brand.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('brands.detail.brand_description')}</span>
                    <span className="info-value info-value-large">{brand.description || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('brands.detail.status')}</span>
                    <span className={`status-badge ${brand.is_active ? 'active' : 'inactive'}`}>
                      {brand.is_active ? t('brands.detail.active') : t('brands.detail.inactive')}
                    </span>
                  </div>
                  {!isEditingInfo && (
                    <button 
                      className="btn-edit"
                      onClick={() => setIsEditingInfo(true)}
                    >
                      {t('brands.detail.edit_info')}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Social Accounts Accordion */}
        <div className="section accordion-section">
          <button 
            className={`accordion-header ${expandedSections.social ? 'expanded' : ''}`}
            onClick={() => toggleSection('social')}
          >
            <div className="accordion-status">
              <IoAdd />
            </div>
            <div className="accordion-content-main">
              <h3 className="accordion-title">2. {t('brands.detail.section_social_accounts')}</h3>
              <p className="accordion-desc">{t('brands.detail.manage_social_accounts')}</p>
            </div>
            <div className="accordion-chevron">
              <IoChevronDown />
            </div>
          </button>

          {expandedSections.social && (
            <div className="accordion-body expanded">
              {brand.social_accounts && brand.social_accounts.length > 0 ? (
                <div className="table-container">
                  <table className="accounts-table">
                    <thead>
                      <tr>
                        <th>{t('brands.detail.page_name')}</th>
                        <th>{t('brands.detail.webhook_fields')}</th>
                        <th>{t('brands.detail.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {brand.social_accounts.map((account) => (
                        <tr key={account.id}>
                          <td>
                            <div className="table-account-name">
                              <div className="account-avatar">
                                {account.platform_name.charAt(0)}
                              </div>
                              <div>
                                <div className="account-name">{account.account_name}</div>
                                <div className="account-id">{account.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="webhook-fields">{account.platform_name}</div>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button className="btn-sm btn-secondary">
                                {t('brands.detail.edit')}
                              </button>
                              <button className="btn-sm btn-danger">
                                <IoClose />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <h3>{t('brands.detail.no_accounts')}</h3>
                  <p>{t('brands.detail.no_accounts_desc')}</p>
                  <button className="btn-primary">
                    <IoAdd /> {t('brands.detail.connect_account')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Settings Accordion */}
        <div className="section accordion-section">
          <button 
            className={`accordion-header ${expandedSections.settings ? 'expanded' : ''}`}
            onClick={() => toggleSection('settings')}
          >
            <div className="accordion-status pending">
              <IoSettings />
            </div>
            <div className="accordion-content-main">
              <h3 className="accordion-title">3. {t('brands.detail.section_settings')}</h3>
              <p className="accordion-desc">{t('brands.detail.manage_settings')}</p>
            </div>
            <div className="accordion-chevron">
              <IoChevronDown />
            </div>
          </button>

          {expandedSections.settings && (
            <div className="accordion-body expanded">
              <div className="settings-form">
                {/* Brand Identity */}
                <div className="settings-group">
                  <div className="settings-group-header">
                    <IoColorFill />
                    <h3 className="settings-group-title">Brand Identity</h3>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>{t('brands.detail.primary_color')}</label>
                      <div className="color-input-group">
                        <input
                          type="color"
                          value={settingsData.color_primary || '#000000'}
                          onChange={(e) => handleSettingsChange('color_primary', e.target.value)}
                          className="color-input"
                        />
                        <input
                          type="text"
                          value={settingsData.color_primary || '#000000'}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow any input during typing, just update the value
                            handleSettingsChange('color_primary', value);
                          }}
                          onBlur={(e) => {
                            const value = e.target.value;
                            const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                            if (!hexRegex.test(value) && value !== '') {
                              handleSettingsChange('color_primary', settingsData.color_primary || '#000000');
                            }
                          }}
                          placeholder="#000000"
                          className="color-value"
                          maxLength={7}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>{t('brands.detail.secondary_color')}</label>
                      <div className="color-input-group">
                        <input
                          type="color"
                          value={settingsData.color_secondary || '#ffffff'}
                          onChange={(e) => handleSettingsChange('color_secondary', e.target.value)}
                          className="color-input"
                        />
                        <input
                          type="text"
                          value={settingsData.color_secondary || '#ffffff'}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow any input during typing, just update the value
                            handleSettingsChange('color_secondary', value);
                          }}
                          onBlur={(e) => {
                            const value = e.target.value;
                            const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                            if (!hexRegex.test(value) && value !== '') {
                              handleSettingsChange('color_secondary', settingsData.color_secondary || '#ffffff');
                            }
                          }}
                          placeholder="#ffffff"
                          className="color-value"
                          maxLength={7}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{t('brands.detail.brand_voice')}</label>
                    <textarea
                      value={settingsData.brand_voice || ''}
                      onChange={(e) => handleSettingsChange('brand_voice', e.target.value)}
                      placeholder={t('brands.detail.brand_voice_placeholder')}
                      className="form-textarea"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Content Settings */}
                <div className="settings-group">
                  <div className="settings-group-header">
                    <IoDocument />
                    <h3 className="settings-group-title">Content Settings</h3>
                  </div>
                  
                  <div className="form-group">
                    <label>{t('brands.detail.content_categories')}</label>
                    <textarea
                      value={settingsData.content_categories || ''}
                      onChange={(e) => handleSettingsChange('content_categories', e.target.value)}
                      placeholder={t('brands.detail.content_categories_placeholder')}
                      className="form-textarea"
                      rows={2}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>{t('brands.detail.content_language')}</label>
                      <select
                        value={settingsData.content_language || 'en'}
                        onChange={(e) => handleSettingsChange('content_language', e.target.value)}
                        className="form-select"
                      >
                        <option value="en">English</option>
                        <option value="vi">Tiếng Việt</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>{t('brands.detail.posts_per_week')}</label>
                      <input
                        type="number"
                        min="1"
                        max="7"
                        value={settingsData.posts_per_week || 3}
                        onChange={(e) => handleSettingsChange('posts_per_week', parseInt(e.target.value))}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Automation Settings */}
                <div className="settings-group">
                  <div className="settings-group-header">
                    <IoSettings />
                    <h3 className="settings-group-title">Automation Settings</h3>
                  </div>
                  
                  <div className="form-group checkbox">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settingsData.auto_respond_enabled || false}
                        onChange={(e) => handleSettingsChange('auto_respond_enabled', e.target.checked)}
                      />
                      <span>{t('brands.detail.auto_respond')}</span>
                    </label>
                  </div>

                  {settingsData.auto_respond_enabled && (
                    <div className="form-group">
                      <label>{t('brands.detail.auto_respond_message')}</label>
                      <textarea
                        value={settingsData.auto_respond_message || ''}
                        onChange={(e) => handleSettingsChange('auto_respond_message', e.target.value)}
                        className="form-textarea"
                        rows={3}
                      />
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <div className="form-actions settings-form-actions">
                  <button
                    className="btn-primary"
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                  >
                    {isSavingSettings ? t('brands.detail.saving') : t('brands.detail.save_settings')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delete Section */}
        <div className="section danger-zone">
          <div className="section-header">
            <h2>{t('brands.detail.delete_brand')}</h2>
          </div>
          <p>{t('brands.detail.delete_confirmation')}</p>
          <button
            className="btn-danger"
            onClick={() => setShowDeleteConfirm(true)}
          >
            {t('brands.detail.delete_brand')}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => !isDeleting && setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{t('brands.detail.delete_brand')}</h2>
            <p>{t('brands.detail.delete_confirmation')}</p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                {t('brands.detail.cancel')}
              </button>
              <button
                className="btn-danger"
                onClick={handleDeleteBrand}
                disabled={isDeleting}
              >
                {isDeleting ? t('brands.detail.deleting') : t('brands.detail.confirm_delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
