import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import type { Brand, CreateBrandData, UpdateBrandData } from '../types/brand';
import '../styles/BrandModal.css';

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  brand?: Brand | null;
}

export const BrandModal: React.FC<BrandModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  brand = null 
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateBrandData>({
    name: '',
    slug: '',
    description: '',
    is_active: true,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing] = useState(!!brand);

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        slug: brand.slug,
        description: brand.description || '',
        is_active: brand.is_active,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        is_active: true,
      });
    }
    setError('');
  }, [brand, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from name when name changes
    if (name === 'name' && !isEditing) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
      
      setFormData({
        ...formData,
        name: value,
        slug: slug,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    setError('');
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isEditing && brand) {
        await apiService.updateBrand(brand.slug, formData as UpdateBrandData);
      } else {
        await apiService.createBrand(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to save brand:', err);
      if (err.response?.data) {
        // Handle validation errors from API
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          const errorMessages = Object.values(errorData).flat().join(', ');
          setError(errorMessages);
        } else {
          setError(err.message || t('brands.error_saving'));
        }
      } else {
        setError(err.message || t('brands.error_saving'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="brand-modal-backdrop" onClick={handleBackdropClick}>
      <div className="brand-modal-content">
        <button className="brand-modal-close" onClick={onClose}>
          ×
        </button>
        
        <h2 className="brand-modal-title">
          {isEditing ? t('brands.detail.edit_brand') : t('brands.create_new')}
        </h2>

        {error && <div className="brand-error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="brand-form">
          <div className="brand-form-group">
            <label htmlFor="name">{t('brands.detail.brand_name')} *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={t('brands.detail.brand_name')}
              disabled={isLoading}
            />
          </div>

          <div className="brand-form-group">
            <label htmlFor="slug">{t('brands.detail.page_name')} *</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder={t('brands.detail.page_name')}
              disabled={isLoading || isEditing}
            />
            <small className="brand-form-help">
              {t('brands.detail.page_name')} sẽ được sử dụng trong URL. Chỉ sử dụng chữ cái, số và dấu gạch ngang.
            </small>
          </div>

          <div className="brand-form-group">
            <label htmlFor="description">{t('brands.detail.brand_description')}</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t('brands.detail.brand_description')}
              disabled={isLoading}
              rows={4}
            />
          </div>

          <div className="brand-form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">{t('brands.active')}</span>
            </label>
            <small className="brand-form-help">
              {t('brands.active')} thương hiệu sẽ được hiển thị và có thể sử dụng trong các chiến dịch tự động hóa.
            </small>
          </div>

          <div className="brand-form-actions">
            <button
              type="button"
              className="brand-cancel-button"
              onClick={onClose}
              disabled={isLoading}
            >
              {t('brands.detail.cancel')}
            </button>
            <button
              type="submit"
              className="brand-submit-button"
              disabled={isLoading}
            >
              {isLoading ? t('brands.detail.saving') : (isEditing ? t('brands.detail.save_settings') : t('brands.create_new'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};