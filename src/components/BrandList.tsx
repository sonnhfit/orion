import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { IoAdd, IoCheckmarkCircle, IoEllipseOutline, IoSettings } from 'react-icons/io5';
import { apiService } from '../services/api';
import type { Brand } from '../types/brand';
import '../styles/BrandList.css';
import { LoadingSpinner } from './LoadingSpinner';
import { BrandModal } from './BrandModal';

export const BrandList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getBrands();
      setBrands(response.results || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('brands.error_loading');
      setError(errorMessage);
      console.error('Failed to fetch brands:', err);
      setBrands([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBrand = () => {
    setIsBrandModalOpen(true);
  };

  const handleBrandModalSuccess = () => {
    fetchBrands(); // Refresh the brand list after successful creation
  };

  const handleBrandClick = (brandSlug: string) => {
    // Navigate to brand details page
    navigate(`/brand-kit/${brandSlug}`);
  };

  const toggleBrandStatus = async (e: React.MouseEvent, brand: Brand) => {
    e.stopPropagation();
    try {
      if (brand.is_active) {
        await apiService.deactivateBrand(brand.slug);
      } else {
        await apiService.activateBrand(brand.slug);
      }
      await fetchBrands();
    } catch (err) {
      console.error('Failed to toggle brand status:', err);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <section className="brands-section">
        <div className="brands-header">
          <div>
            <h2 className="brands-title">{t('brands.my_brands')}</h2>
            <p className="brands-subtitle">{t('brands.manage_your_brands')}</p>
          </div>
          <button className="btn-create-brand" onClick={handleCreateBrand}>
            <IoAdd className="btn-icon" />
            {t('brands.create_new')}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchBrands} className="btn-retry">
              {t('common.retry')}
            </button>
          </div>
        )}

        {brands.length === 0 && !error ? (
          <div className="empty-state">
            <div className="empty-icon">
              <IoAdd />
            </div>
            <h3>{t('brands.no_brands')}</h3>
            <p>{t('brands.no_brands_description')}</p>
            <button className="btn-create-brand-empty" onClick={handleCreateBrand}>
              {t('brands.create_first_brand')}
            </button>
          </div>
        ) : (
          <div className="brands-grid">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="brand-card"
                onClick={() => handleBrandClick(brand.slug)}
              >
                <div className="brand-card-header">
                  <div className="brand-logo">
                    {brand.logo && brand.logo.trim() ? (
                      <img src={brand.logo} alt={brand.name} />
                    ) : (
                      <div className="logo-placeholder">{brand.name.charAt(0).toUpperCase()}</div>
                    )}
                  </div>
                  <button
                    className={`btn-status ${brand.is_active ? 'active' : 'inactive'}`}
                    onClick={(e) => toggleBrandStatus(e, brand)}
                    title={brand.is_active ? t('brands.deactivate') : t('brands.activate')}
                  >
                    {brand.is_active ? <IoCheckmarkCircle /> : <IoEllipseOutline />}
                  </button>
                </div>

                <div className="brand-info">
                  <h3 className="brand-name">{brand.name}</h3>
                  {brand.description && <p className="brand-description">{brand.description}</p>}

                  <div className="brand-meta">
                    <span className="meta-item">
                      <span className="meta-label">{t('brands.social_accounts')}:</span>
                      <span className="meta-value">{brand.social_accounts_count}</span>
                    </span>
                    <span className="meta-item">
                      <span className="meta-label">{t('brands.status')}:</span>
                      <span className={`meta-value status-${brand.is_active ? 'active' : 'inactive'}`}>
                        {brand.is_active ? t('brands.active') : t('brands.inactive')}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="brand-actions">
                  <button className="btn-settings" title={t('brands.settings')}>
                    <IoSettings />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <BrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onSuccess={handleBrandModalSuccess}
      />
    </>
  );
};